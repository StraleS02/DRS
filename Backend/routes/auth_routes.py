import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from database.db import get_db_connection
import os

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", 60))

# Redis (keš baza) - login rate limiting
from services.redis_client import get_redis_client
from services.redis_auth_guard import is_blocked, register_failed_attempt, reset_failures

UPLOAD_FOLDER = "uploads/profile_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


auth_bp = Blueprint("auth", __name__)

# Kreiramo Redis klijent jednom (za cijeli modul).
# Redis mora da radi (docker compose up -d) da bi ovo radilo.
redis_client = get_redis_client()


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400


    # ===============================
    # REDIS – rate limit provera
    # ===============================
    blocked, ttl = is_blocked(redis_client, email)
    if blocked:
        return jsonify({
            "error": "Too many failed attempts. Please try again later.",
            "retry_after_seconds": ttl
        }), 403

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT u.id, u.password_hash, r.name
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE u.email = %s
        """,
        (email,)
    )

    user = cur.fetchone()

    cur.close()
    conn.close()

    # ❌ korisnik ne postoji
    if not user:
        blocked_now, block_ttl, fails_now = register_failed_attempt(redis_client, email)
        return jsonify({"error": "Invalid credentials"}), 401

    user_id, password_hash, role = user

    # ❌ pogrešan password
    if not check_password_hash(password_hash, password):
        blocked_now, block_ttl, fails_now = register_failed_attempt(redis_client, email)

        if blocked_now:
            return jsonify({
                "error": "Too many failed attempts. You are temporarily blocked.",
                "blocked_for_seconds": block_ttl
            }), 403

        return jsonify({
            "error": "Invalid credentials",
            "failed_attempts": fails_now,
            "remaining_before_block": max(0, 3 - fails_now)
        }), 401


    # ===============================
    # ✅ LOGIN USPEŠAN
    # ===============================
    reset_failures(redis_client, email)

    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRES_MINUTES)
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "access_token": token
    }), 200

@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.form

    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["first_name", "last_name", "email", "password"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    date_of_birth = data.get("date_of_birth")
    gender = data.get("gender")
    country = data.get("country")
    street = data.get("street")
    street_number = data.get("street_number")

    password_hash = generate_password_hash(password)

    # 🔽 NOVO: slika sa fronta
    profile_image = request.files.get("profile_image")
    image_path = None

    if profile_image:
        filename = secure_filename(profile_image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        profile_image.save(image_path)

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1️⃣ Provera da li email već postoji
        cur.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )
        if cur.fetchone():
            return jsonify({"error": "Email already exists"}), 409

        # 2️⃣ Insert u users
        cur.execute(
            """
            INSERT INTO users
            (first_name, last_name, email, password_hash, date_of_birth, gender, country, street, street_number, profile_image)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (first_name, last_name, email, password_hash, date_of_birth, gender, country, street, street_number, image_path)
        )

        user_id = cur.fetchone()[0]

        # 3️⃣ Dodela reader role
        cur.execute(
            "SELECT id FROM roles WHERE name = 'reader'"
        )
        role_id = cur.fetchone()[0]

        cur.execute(
            """
            INSERT INTO user_roles (user_id, role_id)
            VALUES (%s, %s)
            """,
            (user_id, role_id)
        )

        conn.commit()

        return jsonify({
            "message": "User registered successfully",
            "user_id": user_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()
