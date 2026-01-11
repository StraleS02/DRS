from flask import Blueprint, request, jsonify

# Redis (keš baza) - login rate limiting
from services.redis_client import get_redis_client
from services.redis_auth_guard import is_blocked, register_failed_attempt, reset_failures


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


    #  provjerimo da li je korisnik blokiran (Redis)
    blocked, ttl = is_blocked(redis_client, email)
    if blocked:
        return jsonify({
            "error": "Too many failed attempts. Please try again later.",
            "retry_after_seconds": ttl
        }), 403


    # --------DB PROVERA--------
    if email == "test@example.com" and password == "tajna123":
          # Ako je login uspešan, resetujemo fail counter u Redis-u
        reset_failures(redis_client, email)
        return jsonify({"message": "Login successful"}), 200


    #  Login nije uspešan -> zabilježimo neuspešan pokušaj u Redis-u
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

  