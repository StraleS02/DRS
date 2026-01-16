from flask import Blueprint, request, jsonify
from database.db import db
from auth.jwt_middleware import jwt_required
from models.user import User

admin_bp = Blueprint("admin", __name__)

# =========================
# Lista svih korisnika
# =========================
@admin_bp.route("/api/admin/users", methods=["GET"])
@jwt_required
def list_users():
    user = getattr(request, "user", None)
    if not user or user.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    try:
        users = User.query.all()
        result = []
        for u in users:
            result.append({
                "id": u.id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "date_of_birth": str(u.date_of_birth) if u.date_of_birth else None,
                "gender": u.gender,
                "country": u.country,
                "street": u.street,
                "street_number": u.street_number
            })

        return jsonify({"users": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# Brisanje korisnika
# =========================
@admin_bp.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required
def delete_user(user_id):
    user = getattr(request, "user", None)
    if not user or user.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    try:
        target_user = User.query.get(user_id)
        if not target_user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(target_user)
        db.session.commit()

        return jsonify({"message": f"User {user_id} deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
