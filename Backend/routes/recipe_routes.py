import os
import json
import jwt
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from auth.jwt_middleware import jwt_required

from database.db import get_db_connection

JWT_SECRET = os.getenv("JWT_SECRET")

recipe_bp = Blueprint("recipes", __name__)

UPLOAD_FOLDER = "uploads/recipes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@recipe_bp.route("/api/recipes", methods=["POST"])
@jwt_required
def create_recipe():
    """
    Kreiranje novog recepta (samo AUTHOR)
    """

    user = getattr(request, "user", None)
    if not user:
        return jsonify({"error": "User not found in request"}), 401

    author_id = user.get("user_id")
    role = user.get("role")

    # ❌ Samo AUTHOR može da postavlja recepte
    if role != "author":
        return jsonify({"error": "Only authors can create recipes"}), 403

    data = request.form

    required_fields = [
        "name",
        "meal_type",
        "prep_time",
        "difficulty",
        "servings",
        "ingredients",
        "steps"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    name = data.get("name")
    meal_type = data.get("meal_type")
    prep_time = int(data.get("prep_time"))
    difficulty = data.get("difficulty")
    servings = int(data.get("servings"))

    ingredients = json.loads(data.get("ingredients"))
    steps = json.loads(data.get("steps"))
    tags = json.loads(data.get("tags", "[]"))

    # 🖼️ Slika
    image = request.files.get("image")
    image_path = None

    if image:
        filename = secure_filename(image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(image_path)

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1️⃣ Insert recipe
        cur.execute(
            """
            INSERT INTO recipes
            (author_id, name, meal_type, prep_time, difficulty, servings, image)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (author_id, name, meal_type, prep_time, difficulty, servings, image_path)
        )

        recipe_id = cur.fetchone()[0]

        # 2️⃣ Ingredients
        for ing in ingredients:
            cur.execute(
                "SELECT id FROM ingredients WHERE name = %s",
                (ing["name"],)
            )
            row = cur.fetchone()

            if row:
                ingredient_id = row[0]
            else:
                cur.execute(
                    "INSERT INTO ingredients (name) VALUES (%s) RETURNING id",
                    (ing["name"],)
                )
                ingredient_id = cur.fetchone()[0]

            cur.execute(
                """
                INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
                VALUES (%s, %s, %s)
                """,
                (recipe_id, ingredient_id, ing["quantity"])
            )

        # 3️⃣ Steps
        for index, step in enumerate(steps, start=1):
            cur.execute(
                """
                INSERT INTO recipe_steps (recipe_id, step_number, description)
                VALUES (%s, %s, %s)
                """,
                (recipe_id, index, step)
            )

        # 4️⃣ Tags
        for tag in tags:
            cur.execute(
                "SELECT id FROM tags WHERE name = %s",
                (tag,)
            )
            row = cur.fetchone()

            if row:
                tag_id = row[0]
            else:
                cur.execute(
                    "INSERT INTO tags (name) VALUES (%s) RETURNING id",
                    (tag,)
                )
                tag_id = cur.fetchone()[0]

            cur.execute(
                """
                INSERT INTO recipe_tags (recipe_id, tag_id)
                VALUES (%s, %s)
                """,
                (recipe_id, tag_id)
            )

        conn.commit()

        return jsonify({
            "message": "Recipe created successfully",
            "recipe_id": recipe_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()
