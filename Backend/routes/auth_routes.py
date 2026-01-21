from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from database.db import db
from models.user import User
from models.user_role import user_roles
from models.role import Role
# Redis (keš baza) - login rate limiting
from services.redis_client import get_redis_client
from services.redis_auth_guard import is_blocked, register_failed_attempt, reset_failures
import jwt
import os
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", 60))

UPLOAD_FOLDER = "uploads/profile_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

auth_bp = Blueprint("auth", __name__)

redis_client = get_redis_client()

# ===============================
# LOGIN
# ===============================
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
    # 1️⃣ Redis – provera da li je blokiran
    # ===============================
    blocked, ttl = is_blocked(redis_client, email)
    if blocked:
        return jsonify({
            "error": "Too many failed attempts. Please try again later.",
            "retry_after_seconds": ttl
        }), 403

    # ===============================
    # 2️⃣ ORM – dohvat korisnika
    # ===============================
    user = User.query.filter_by(email=email).first()

    # ❌ korisnik ne postoji
    if not user:
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

    # ❌ lozinka nije dobra
    if not check_password_hash(user.password_hash, password):
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
    # 3️⃣ Login uspešan → reset Redis failova
    # ===============================
    reset_failures(redis_client, email)

    # ===============================
    # 4️⃣ Rola korisnika
    # ===============================
    role = user.roles[0].name if user.roles else "reader"

    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRES_MINUTES)
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "access_token": token
    }), 200


# ===============================
# REGISTER
# ===============================
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

    # Password hash
    password_hash = generate_password_hash(password)

    # Upload slike ako postoji
    profile_image_file = request.files.get("profile_image")
    image_path = None
    if profile_image_file:
        filename = secure_filename(profile_image_file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        profile_image_file.save(image_path)

    # Provera da li email već postoji
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    # Kreiranje korisnika
    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=password_hash,
        date_of_birth=date_of_birth,
        gender=gender,
        country=country,
        street=street,
        street_number=street_number,
        profile_image=image_path
    )

    # Dodela role "reader"
    reader_role = Role.query.filter_by(name="reader").first()
    if not reader_role:
        # Kreiraj role ako ne postoji
        reader_role = Role(name="reader")
        db.session.add(reader_role)
        db.session.commit()

    user.roles.append(reader_role)

    # Sačuvaj u bazi
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user_id": user.id
    }), 201
