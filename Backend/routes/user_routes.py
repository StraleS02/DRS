import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from auth.jwt_middleware import jwt_required
from database.db import db
from models.user import User

user_bp = Blueprint("users", __name__)

UPLOAD_FOLDER = "uploads/profile_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@user_bp.route("/api/users/profile", methods=["PUT"])
@jwt_required
def update_profile():
    """
    Izmena profila (reader / author)
    """
    user_id = request.user["user_id"]  # 👈 iz JWT-a
    data = request.form

    # Dohvati korisnika iz baze
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Upload nove slike ako postoji
    image_file = request.files.get("profile_image")
    if image_file:
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(image_path)
        user.profile_image = image_path  # update slike

    # Update ostalih polja
    if "first_name" in data:
        user.first_name = data.get("first_name")
    if "last_name" in data:
        user.last_name = data.get("last_name")
    if "email" in data:
        user.email = data.get("email")
    if "date_of_birth" in data:
        user.date_of_birth = data.get("date_of_birth")
    if "gender" in data:
        user.gender = data.get("gender")
    if "country" in data:
        user.country = data.get("country")
    if "street" in data:
        user.street = data.get("street")
    if "street_number" in data:
        user.street_number = data.get("street_number")

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
