import os
import uuid
from flask import Blueprint, request, jsonify
from auth.jwt_middleware import jwt_required
from database.db import db
from models.recipe_rating import RecipeRating
from models.favorite_recipe import FavoriteRecipe
from models.recipe_comment import RecipeComment
from models.recipe import Recipe
from models.user import User
from services.email_service import send_email
from services.minio_client import minio_client, BUCKET_NAME

interaction_bp = Blueprint("recipe_interactions", __name__)


# ==================================================
# RATE RECIPE
# ==================================================
@interaction_bp.route("/api/recipes/<int:recipe_id>/rate", methods=["POST"])
@jwt_required
def rate_recipe(recipe_id):
    user_id = request.user["user_id"]
    rating = request.json.get("rating")

    if rating not in [1, 2, 3, 4, 5]:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    if recipe.author_id == user_id:
        return jsonify({"error": "You cannot rate your own recipe"}), 403

    existing = RecipeRating.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()

    if existing:
        existing.rating = rating
    else:
        db.session.add(RecipeRating(
            user_id=user_id,
            recipe_id=recipe_id,
            rating=rating
        ))

    db.session.commit()
    return jsonify({"message": "Recipe rated successfully"}), 200


# ==================================================
# FAVORITE RECIPE
# ==================================================
@interaction_bp.route("/api/recipes/<int:recipe_id>/favorite", methods=["POST"])
@jwt_required
def favorite_recipe(recipe_id):
    user_id = request.user["user_id"]

    favorite = FavoriteRecipe.query.filter_by(
        user_id=user_id,
        recipe_id=recipe_id
    ).first()

    if favorite:
        # If it exists, remove it → toggle off
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Recipe removed from favorites", "favorited": False}), 200

    # If it doesn't exist, add it → toggle on
    new_fav = FavoriteRecipe(user_id=user_id, recipe_id=recipe_id)
    db.session.add(new_fav)
    db.session.commit()
    return jsonify({"message": "Recipe added to favorites", "favorited": True}), 201


# =========================
# COMMENT RECIPE
# =========================
@interaction_bp.route("/api/recipes/<int:recipe_id>/comment", methods=["POST"])
@jwt_required
def comment_recipe(recipe_id):
    user_id = request.user["user_id"]

    title = request.form.get("title")
    content = request.form.get("content")
    image_file = request.files.get("image")  # 👈 opcionalno

    if not title:
        return jsonify({"error": "Comment title is required"}), 400
    if not content:
        return jsonify({"error": "Comment content is required"}), 400

    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    # ========================
    # UPLOAD IMAGE TO MINIO
    # ========================
    image_url = None
    if image_file:
        ext = image_file.filename.rsplit(".", 1)[-1]
        object_name = f"comments/{uuid.uuid4()}.{ext}"

        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            image_file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=image_file.content_type
        )

        image_url = f"http://{os.getenv('MINIO_ENDPOINT')}/{BUCKET_NAME}/{object_name}"

    # ========================
    # CREATE COMMENT
    # ========================
    comment = RecipeComment(
        user_id=user_id,
        recipe_id=recipe_id,
        title=title,
        content=content,
        image=image_url
    )

    db.session.add(comment)
    db.session.commit()

    # ========================
    # EMAIL AUTHOR
    # ========================
    author = User.query.get(recipe.author_id)
    commenter = User.query.get(user_id)

    if author and author.email:
        subject = f"New comment on your recipe: {recipe.name}"
        body = f"""
Hello {author.first_name},

Your recipe "{recipe.name}" just received a new comment.

Commented by:
{commenter.first_name} {commenter.last_name}
({commenter.email})

Title:
{title}

Comment:
{content}

Image:
{"Yes" if image_url else "No"}

Best regards,
Your App Team
        """
        send_email(author.email, subject, body)

    return jsonify({"message": "Comment added successfully"}), 201
