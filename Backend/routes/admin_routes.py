from flask import Blueprint, request, jsonify
from database.db import get_db_connection
from auth.jwt_middleware import jwt_required

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

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, first_name, last_name, email, date_of_birth, gender, country, street, street_number
            FROM users
        """)
        rows = cur.fetchall()

        users = []
        for row in rows:
            users.append({
                "id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "email": row[3],
                "date_of_birth": str(row[4]) if row[4] else None,
                "gender": row[5],
                "country": row[6],
                "street": row[7],
                "street_number": row[8]
            })

        return jsonify({"users": users}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# =========================
# Brisanje korisnika
# =========================
@admin_bp.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required
def delete_user(user_id):
    user = getattr(request, "user", None)
    if not user or user.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Provera da li korisnik postoji
        cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cur.fetchone():
            return jsonify({"error": "User not found"}), 404

        # Brisanje korisnika (cascade će obrisati i role, komentare, itd.)
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()

        return jsonify({"message": f"User {user_id} deleted successfully"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
