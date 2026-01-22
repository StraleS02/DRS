from flask import Blueprint, request, jsonify, send_file
from sqlalchemy import func
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.units import cm
from database.db import db
from auth.jwt_middleware import jwt_required
from models.user import User
from models.recipe import Recipe
from models.role import Role
from models.recipe_rating import RecipeRating
from services.minio_client import minio_client, BUCKET_NAME
import os

admin_bp = Blueprint("admin", __name__)

# --------------------------------------------------
# Helper: admin check
# --------------------------------------------------
def is_admin():
    return getattr(request, "user", {}).get("role") == "admin"

# =========================
# Lista svih korisnika
# =========================
@admin_bp.route("/api/admin/users", methods=["GET"])
@jwt_required
def list_users():
    if not is_admin():
        return jsonify({"error": "Admin access required"}), 403

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
            "street_number": u.street_number,
            "profile_image": u.profile_image
        })

    return jsonify({"users": result}), 200

# =========================
# Brisanje korisnika
# =========================
@admin_bp.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required
def delete_user(user_id):
    if not is_admin():
        return jsonify({"error": "Admin access required"}), 403

    target_user = User.query.get(user_id)
    if not target_user:
        return jsonify({"error": "User not found"}), 404

    # Ako korisnik ima profilnu sliku na MinIO-u → obriši
    if target_user.profile_image:
        try:
            # Pretpostavljamo da je URL oblika: http://<endpoint>/<bucket>/users/<uuid>.ext
            object_path = "/".join(target_user.profile_image.split("/")[4:])
            if minio_client.bucket_exists(BUCKET_NAME):
                minio_client.remove_object(BUCKET_NAME, object_path)
        except Exception as e:
            # Ne zaustavljaj brisanje korisnika zbog greške u MinIO-u
            print(f"Warning: Could not delete profile image from MinIO: {e}")

    try:
        db.session.delete(target_user)
        db.session.commit()
        return jsonify({"message": f"User {user_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ==================================================
#  ADMIN DASHBOARD STATS
# ==================================================
@admin_bp.route("/api/admin/stats", methods=["GET"])
@jwt_required
def admin_stats():
    if not is_admin():
        return jsonify({"error": "Forbidden"}), 403

    total_users = User.query.count()
    total_recipes = Recipe.query.count()

    author_role = Role.query.filter_by(name="author").first()
    reader_role = Role.query.filter_by(name="reader").first()

    return jsonify({
        "total_users": total_users,
        "total_recipes": total_recipes,
        "total_authors": len(author_role.users) if author_role else 0,
        "total_readers": len(reader_role.users) if reader_role else 0
    }), 200

# ==================================================
#  GENERATE PDF REPORT: Top 5 Authors
# ==================================================
@admin_bp.route("/api/admin/report/top-authors", methods=["GET"])
@jwt_required
def top_authors_pdf():
    if not is_admin():
        return jsonify({"error": "Forbidden"}), 403

    top_authors = (
        db.session.query(
            User.first_name,
            User.last_name,
            func.avg(RecipeRating.rating).label("avg_rating"),
            func.count(Recipe.id).label("total_recipes")
        )
        .join(Recipe, Recipe.author_id == User.id)
        .join(RecipeRating, RecipeRating.recipe_id == Recipe.id)
        .group_by(User.id)
        .order_by(func.avg(RecipeRating.rating).desc())
        .limit(5)
        .all()
    )

    buffer = BytesIO()
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    elements.append(Paragraph("Top 5 Authors Report", styles["Title"]))
    elements.append(Spacer(1, 1 * cm))

    table_data = [["Author", "Average rating", "Total recipes"]]

    for a in top_authors:
        table_data.append([
            f"{a.first_name} {a.last_name}",
            f"{round(a.avg_rating, 2)}",
            str(a.total_recipes)
        ])

    table = Table(table_data, colWidths=[7 * cm, 4 * cm, 4 * cm])
    elements.append(table)

    doc.build(elements)
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="top_authors_report.pdf",
        mimetype="application/pdf"
    )
