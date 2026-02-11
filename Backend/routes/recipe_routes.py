import os
import json
import uuid
from flask import Blueprint, request, jsonify
from auth.jwt_middleware import jwt_required
from database.db import db
from models.recipe import Recipe
from models.recipe_ingredient import RecipeIngredient
from models.ingredient import Ingredient
from models.recipe_step import RecipeStep
from models.tag import Tag
from models.recipe_tag import RecipeTag
from services.minio_client import minio_client, BUCKET_NAME

recipe_bp = Blueprint("recipes", __name__)


# ==================================================
# CREATE RECIPE
# ==================================================
@recipe_bp.route("/api/recipes", methods=["POST"])
@jwt_required
def create_recipe():
    user = getattr(request, "user", None)
    if not user:
        return jsonify({"error": "User not found in request"}), 401

    if user.get("role") != "author":
        return jsonify({"error": "Only authors can create recipes"}), 403

    author_id = user.get("user_id")
    data = request.form

    required_fields = ["name", "meal_type", "prep_time", "difficulty", "servings", "ingredients", "steps"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    ingredients_data = json.loads(data.get("ingredients"))
    steps_data = json.loads(data.get("steps"))
    tags_data = json.loads(data.get("tags", "[]"))

    # =========================
    # UPLOAD IMAGE (MinIO)
    # =========================
    image_file = request.files.get("image")
    image_url = None

    if image_file:
        ext = image_file.filename.rsplit(".", 1)[-1]
        object_name = f"recipes/{uuid.uuid4()}.{ext}"

        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            image_file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=image_file.content_type
        )

        image_url = f"http://{os.getenv('MINIO_ENDPOINT')}/{BUCKET_NAME}/{object_name}"

    try:
        recipe = Recipe(
            author_id=author_id,
            name=data.get("name"),
            meal_type=data.get("meal_type"),
            prep_time=int(data.get("prep_time")),
            difficulty=data.get("difficulty"),
            servings=int(data.get("servings")),
            image=image_url
        )

        db.session.add(recipe)
        db.session.flush()

        # =========================
        # INGREDIENTS
        # =========================
        for ing in ingredients_data:
            ingredient = Ingredient.query.filter_by(name=ing["name"]).first()
            if not ingredient:
                ingredient = Ingredient(name=ing["name"])
                db.session.add(ingredient)
                db.session.flush()

            db.session.add(RecipeIngredient(
                recipe_id=recipe.id,
                ingredient_id=ingredient.id,
                quantity=ing["quantity"]
            ))

        # =========================
        # STEPS
        # =========================
        for idx, step in enumerate(steps_data, start=1):
            db.session.add(RecipeStep(
                recipe_id=recipe.id,
                step_number=idx,
                description=step
            ))

        # =========================
        # TAGS
        # =========================
        for tag_name in tags_data:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
                db.session.flush()

            db.session.add(RecipeTag(recipe_id=recipe.id, tag_id=tag.id))

        db.session.commit()
        return jsonify({"message": "Recipe created successfully", "recipe_id": recipe.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==================================================
# UPDATE RECIPE
# ==================================================
@recipe_bp.route("/api/recipes/<int:recipe_id>", methods=["PUT"])
@jwt_required
def update_recipe(recipe_id):
    user_id = request.user.get("user_id")
    recipe = Recipe.query.get(recipe_id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    if recipe.author_id != user_id:
        return jsonify({"error": "You are not allowed to edit this recipe"}), 403

    data = request.form

    # Update osnovnih polja
    for field in ["name", "meal_type", "prep_time", "difficulty", "servings"]:
        if field in data:
            setattr(recipe, field, data.get(field))

    # =========================
    # UPDATE IMAGE (delete old)
    # =========================
    image_file = request.files.get("image")
    if image_file:
        try:
            if recipe.image:
                old_object = "/".join(recipe.image.split("/")[4:])
                minio_client.remove_object(BUCKET_NAME, old_object)
        except Exception as e:
            print(f"Warning: could not delete old image: {e}")

        ext = image_file.filename.rsplit(".", 1)[-1]
        object_name = f"recipes/{uuid.uuid4()}.{ext}"

        minio_client.put_object(
            BUCKET_NAME,
            object_name,
            image_file,
            length=-1,
            part_size=10 * 1024 * 1024,
            content_type=image_file.content_type
        )

        recipe.image = f"http://{os.getenv('MINIO_ENDPOINT')}/{BUCKET_NAME}/{object_name}"

    try:
        db.session.commit()
        return jsonify({"message": "Recipe updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==================================================
# DELETE RECIPE
# ==================================================
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
        # Obriši sliku iz MinIO-a
        if recipe.image:
            try:
                object_name = "/".join(recipe.image.split("/")[4:])
                minio_client.remove_object(BUCKET_NAME, object_name)
            except Exception as e:
                print(f"Warning: could not delete recipe image: {e}")

        db.session.delete(recipe)
        db.session.commit()
        return jsonify({"message": "Recipe deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# ==================================================
# GET ALL RECIPES
# ==================================================
@recipe_bp.route("/api/recipes", methods=["GET"])
@jwt_required
def get_all_recipes():

    recipes = (
        Recipe.query
        .order_by(Recipe.created_at.desc())
        .all()
    )

    output = []

    for r in recipes:
        output.append({
            "id": r.id,
            "name": r.name,
            "meal_type": r.meal_type,
            "prep_time": r.prep_time,
            "difficulty": r.difficulty,
            "servings": r.servings,
            "image": r.image,
            "created_at": r.created_at.isoformat(),

            "author": {
                "id": r.author.id,
                "first_name": r.author.first_name,
                "last_name": r.author.last_name,
                "profile_image": r.author.profile_image,
            },

            "average_rating": (
                round(
                    sum(rt.rating for rt in r.ratings) / len(r.ratings),
                    2
                ) if r.ratings else 0
            )
        })

    return jsonify(output), 200

# ==================================================
# GET RECIPE BY ID
# ==================================================
@recipe_bp.route("/api/recipes/<int:recipe_id>", methods=["GET"])
@jwt_required
def get_recipe_by_id(recipe_id):

    recipe = Recipe.query.get(recipe_id)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify({

        "id": recipe.id,
        "name": recipe.name,
        "meal_type": recipe.meal_type,
        "prep_time": recipe.prep_time,
        "difficulty": recipe.difficulty,
        "servings": recipe.servings,
        "image": recipe.image,
        "created_at": recipe.created_at.isoformat(),

        "author": {
            "id": recipe.author.id,
            "first_name": recipe.author.first_name,
            "last_name": recipe.author.last_name,
            "profile_image": recipe.author.profile_image,
        },

        "average_rating": (
            round(
                sum(r.rating for r in recipe.ratings) / len(recipe.ratings),
                2
            ) if recipe.ratings else 0
        ),

        "ingredients": [
            {
                "id": ri.ingredient.id,
                "name": ri.ingredient.name,
                "quantity": ri.quantity
            }
            for ri in recipe.ingredients
        ],

        "steps": [
            {
                "step_number": s.step_number,
                "description": s.description
            }
            for s in recipe.steps
        ],

        "tags": [
            t.tag.name
            for t in recipe.tags
        ],

        "comments": [
            {
                "id": c.id,
                "content": c.content,
                "title": c.title,
                "image": c.image,
                "recipe_id": c.recipe.id,
                "user": {
                    "id": c.user.id,
                    "email": c.user.email
                }
            }
            for c in recipe.comments
        ]
    }), 200
