from flask import Blueprint, jsonify
from sqlalchemy import func
from database.db import db
from models.user import User
from models.recipe import Recipe
from models.recipe_rating import RecipeRating

author_bp = Blueprint("author", __name__)

# ============================================================
#  Profil autora (vidljiv drugim korisnicima)
# ============================================================
@author_bp.route("/api/authors/<int:author_id>", methods=["GET"])
def get_author_profile(author_id):
    # -----------------------------
    # Autor
    # -----------------------------
    author = User.query.get(author_id)
    if not author:
        return jsonify({"error": "Author not found"}), 404

    # -----------------------------
    # Recepti autora
    # -----------------------------
    recipes = Recipe.query.filter_by(author_id=author_id).order_by(Recipe.created_at.desc()).all()

    # -----------------------------
    # Ukupan broj recepata
    # -----------------------------
    total_recipes = len(recipes)

    # -----------------------------
    # Prosečna ocena svih recepata autora
    # -----------------------------
    avg_rating = (
        db.session.query(func.avg(RecipeRating.rating))
        .join(Recipe, Recipe.id == RecipeRating.recipe_id)
        .filter(Recipe.author_id == author_id)
        .scalar()
    )

    avg_rating = round(avg_rating, 2) if avg_rating else 0

    # -----------------------------
    # Formatiranje recepata za frontend
    # -----------------------------
    recipes_output = []
    for r in recipes:
        recipes_output.append({
            "id": r.id,
            "name": r.name,
            "meal_type": r.meal_type,
            "prep_time": r.prep_time,
            "difficulty": r.difficulty,
            "servings": r.servings,
            "image": r.image,
            "created_at": r.created_at.isoformat()
        })

    # -----------------------------
    # Response
    # -----------------------------
    return jsonify({
        "author": {
            "id": author.id,
            "first_name": author.first_name,
            "last_name": author.last_name,
            "email": author.email,
            "profile_image": author.profile_image,
            "joined_at": author.created_at.isoformat(),
            "total_recipes": total_recipes,
            "average_rating": avg_rating
        },
        "recipes": recipes_output
    }), 200
