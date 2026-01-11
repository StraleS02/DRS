from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # --------DB PROVERA--------
    if email == "test@example.com" and password == "tajna123":
        return jsonify({"message": "Login successful"}), 200

    return jsonify({"error": "Invalid credentials"}), 401
