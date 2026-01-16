from flask import Blueprint, request, jsonify
from database.db import db
from auth.jwt_middleware import jwt_required
from models.recipe_rating import RecipeRating
from models.favorite_recipe import FavoriteRecipe
from models.recipe_comment import RecipeComment
from models.recipe import Recipe

interaction_bp = Blueprint("recipe_interactions", __name__)

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
    content = request.json.get("content")

    if not content:
        return jsonify({"error": "Comment content is required"}), 400

    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    comment = RecipeComment(
        user_id=user_id,
        recipe_id=recipe_id,
        content=content
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({"message": "Comment added"}), 201
