from database.db import db
from models.recipe import Recipe
from models.ingredient import Ingredient

class RecipeIngredient(db.Model):
    __tablename__ = "recipe_ingredients"

    recipe_id = db.Column(db.BigInteger, db.ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = db.Column(db.BigInteger, db.ForeignKey("ingredients.id"), primary_key=True)
    quantity = db.Column(db.String(100), nullable=False)

    recipe = db.relationship("Recipe", back_populates="ingredients")
    ingredient = db.relationship("Ingredient", back_populates="recipes")
