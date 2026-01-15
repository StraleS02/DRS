import jwt
import os
from functools import wraps
from flask import request, jsonify

JWT_SECRET = os.getenv("JWT_SECRET")

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        try:
            token = auth_header.split(" ")[1]  # Bearer TOKEN
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = payload  # 👈 OVDE se čuva user
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated
