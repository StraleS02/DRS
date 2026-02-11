import os
import uuid
from flask import Blueprint, request, jsonify
from auth.jwt_middleware import jwt_required
from database.db import db
from models.user import User
from models.recipe import Recipe
from models.favorite_recipe import FavoriteRecipe
from services.minio_client import minio_client, BUCKET_NAME
from werkzeug.utils import secure_filename

user_bp = Blueprint("users", __name__)

# =========================
# UPDATE PROFILE
# =========================
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
        try:
            # Ako korisnik već ima sliku → obriši staru iz MinIO-a
            if user.profile_image:
                old_object_path = "/".join(user.profile_image.split("/")[4:])
                if minio_client.bucket_exists(BUCKET_NAME):
                    minio_client.remove_object(BUCKET_NAME, old_object_path)
        except Exception as e:
            print(f"Warning: could not delete old profile image: {e}")

        # Upload nove slike
        ext = image_file.filename.rsplit(".", 1)[-1]
        object_name = f"users/{uuid.uuid4()}.{ext}"

        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            image_file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=image_file.content_type
        )

        # Sačuvaj novi URL u bazi
        user.profile_image = f"http://{os.getenv('MINIO_ENDPOINT')}/{BUCKET_NAME}/{object_name}"

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

# =========================
# GET USER BY ID
# =========================
@user_bp.route("/api/users/<int:user_id>", methods=["GET"])
@jwt_required
def get_user_by_id(user_id):
    """
    Dobavljanje korisnika po ID-u
    """

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
        "gender": user.gender,
        "country": user.country,
        "street": user.street,
        "street_number": user.street_number,
        "profile_image": user.profile_image,
        "created_at": user.created_at.isoformat(),
        "roles": [r.name for r in user.roles]
    }), 200


# ==================================
# GET RECIPES INFO FOR CURRENT USER
# ==================================
@user_bp.route("/api/users/me", methods=["GET"])
@jwt_required
def get_me():
    
    user_id = request.user["user_id"]

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    favorite_ids = [
        fav.recipe_id
        for fav in FavoriteRecipe.query.filter_by(user_id=user_id).all()
    ]

    recipe_ids = [
        recipe.id
        for recipe in Recipe.query.filter_by(author_id=user_id).all()
    ]

    return jsonify({
        "favorite_ids": favorite_ids,
        "recipe_ids": recipe_ids
    }), 200
