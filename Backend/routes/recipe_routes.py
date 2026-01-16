import os
import json
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from auth.jwt_middleware import jwt_required
from database.db import db
from models.recipe import Recipe
from models.recipe_ingredient import RecipeIngredient
from models.ingredient import Ingredient
from models.recipe_step import RecipeStep
from models.tag import Tag
from models.recipe_tag import RecipeTag

recipe_bp = Blueprint("recipes", __name__)

UPLOAD_FOLDER = "uploads/recipes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ======================
# CREATE RECIPE
# ======================
@recipe_bp.route("/api/recipes", methods=["POST"])
@jwt_required
def create_recipe():
    user = getattr(request, "user", None)
    if not user:
        return jsonify({"error": "User not found in request"}), 401

    author_id = user.get("user_id")
    role = user.get("role")

    if role != "author":
        return jsonify({"error": "Only authors can create recipes"}), 403

    data = request.form
    required_fields = ["name", "meal_type", "prep_time", "difficulty", "servings", "ingredients", "steps"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    name = data.get("name")
    meal_type = data.get("meal_type")
    prep_time = int(data.get("prep_time"))
    difficulty = data.get("difficulty")
    servings = int(data.get("servings"))
    ingredients_data = json.loads(data.get("ingredients"))
    steps_data = json.loads(data.get("steps"))
    tags_data = json.loads(data.get("tags", "[]"))

    # Upload slike
    image_file = request.files.get("image")
    image_path = None
    if image_file:
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(image_path)

    try:
        recipe = Recipe(
            author_id=author_id,
            name=name,
            meal_type=meal_type,
            prep_time=prep_time,
            difficulty=difficulty,
            servings=servings,
            image=image_path
        )
        db.session.add(recipe)
        db.session.flush()  # da dobijemo ID recepta pre commit-a

        # Ingredients
        for ing in ingredients_data:
            ingredient = Ingredient.query.filter_by(name=ing["name"]).first()
            if not ingredient:
                ingredient = Ingredient(name=ing["name"])
                db.session.add(ingredient)
                db.session.flush()

            ri = RecipeIngredient(
                recipe_id=recipe.id,
                ingredient_id=ingredient.id,
                quantity=ing["quantity"]
            )
            db.session.add(ri)

        # Steps
        for idx, step in enumerate(steps_data, start=1):
            rs = RecipeStep(recipe_id=recipe.id, step_number=idx, description=step)
            db.session.add(rs)

        # Tags
        for tag_name in tags_data:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
                db.session.flush()

            rt = RecipeTag(recipe_id=recipe.id, tag_id=tag.id)
            db.session.add(rt)

        db.session.commit()
        return jsonify({"message": "Recipe created successfully", "recipe_id": recipe.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ======================
# UPDATE RECIPE
# ======================
@recipe_bp.route("/api/recipes/<int:recipe_id>", methods=["PUT"])
@jwt_required
def update_recipe(recipe_id):
    user_id = request.user.get("user_id")
    data = request.form

    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    if recipe.author_id != user_id:
        return jsonify({"error": "You are not allowed to edit this recipe"}), 403

    # Update osnovnih polja
    for field in ["name", "meal_type", "prep_time", "difficulty", "servings"]:
        if data.get(field):
            setattr(recipe, field, data.get(field))

    # Slika
    image_file = request.files.get("image")
    if image_file:
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(image_path)
        recipe.image = image_path

    try:
        db.session.commit()
        return jsonify({"message": "Recipe updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ======================
# DELETE RECIPE
# ======================
@recipe_bp.route("/api/recipes/<int:recipe_id>", methods=["DELETE"])
@jwt_required
def delete_recipe(recipe_id):
    user_id = request.user.get("user_id")
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    if recipe.author_id != user_id:
        return jsonify({"error": "You are not allowed to delete this recipe"}), 403

    try:
        db.session.delete(recipe)
        db.session.commit()
        return jsonify({"message": "Recipe deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
