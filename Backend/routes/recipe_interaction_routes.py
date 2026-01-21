from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database.db import db
from auth.jwt_middleware import jwt_required
from models.recipe_rating import RecipeRating
from models.favorite_recipe import FavoriteRecipe
from models.recipe_comment import RecipeComment
from models.recipe import Recipe
from models.user import User
from services.email_service import send_email
import os

interaction_bp = Blueprint("recipe_interactions", __name__)

UPLOAD_FOLDER = "uploads/comment_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@interaction_bp.route("/api/recipes/<int:recipe_id>/rate", methods=["POST"])
@jwt_required
def rate_recipe(recipe_id):
    user_id = request.user["user_id"]
    rating = request.json.get("rating")

    if not rating or rating not in [1, 2, 3, 4, 5]:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    if recipe.author_id == user_id:
        return jsonify({"error": "You cannot rate your own recipe"}), 403

    existing = RecipeRating.query.filter_by(
        user_id=user_id,
        recipe_id=recipe_id
    ).first()

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

@interaction_bp.route("/api/recipes/<int:recipe_id>/favorite", methods=["POST"])
@jwt_required
def favorite_recipe(recipe_id):
    user_id = request.user["user_id"]

    exists = FavoriteRecipe.query.filter_by(
        user_id=user_id,
        recipe_id=recipe_id
    ).first()

    if exists:
        return jsonify({"message": "Recipe already in favorites"}), 200

    db.session.add(FavoriteRecipe(
        user_id=user_id,
        recipe_id=recipe_id
    ))

    db.session.commit()

    return jsonify({"message": "Recipe added to favorites"}), 201

@interaction_bp.route("/api/recipes/<int:recipe_id>/comment", methods=["POST"])
@jwt_required
def comment_recipe(recipe_id):
    user_id = request.user["user_id"]

    # ========================
    # Podaci
    # ========================
    title = request.form.get("title")
    content = request.form.get("content")
    image = request.files.get("image")  # 👈 opcionalno

    # ========================
    # Validacija
    # ========================
    if not title:
        return jsonify({"error": "Comment title is required"}), 400

    if not content:
        return jsonify({"error": "Comment content is required"}), 400

    # ========================
    # Provera recepta
    # ========================
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    # ========================
    # Snimanje slike (ako postoji)
    # ========================
    image_path = None
    if image:
        filename = secure_filename(image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(image_path)

    # ========================
    # Kreiranje komentara
    # ========================
    comment = RecipeComment(
        user_id=user_id,
        recipe_id=recipe_id,
        title=title,
        content=content,
        image=image_path
    )

    db.session.add(comment)
    db.session.commit()

    # ========================
    # Slanje mejla autoru recepta
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
{"Attached" if image_path else "No image"}

Best regards,
Your App Team
        """

        send_email(author.email, subject, body)

    return jsonify({"message": "Comment added successfully"}), 201
