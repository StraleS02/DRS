from database.db import db
from models.recipe import Recipe
from models.tag import Tag

class RecipeTag(db.Model):
    __tablename__ = "recipe_tags"

    recipe_id = db.Column(db.BigInteger, db.ForeignKey("recipes.id"), primary_key=True)
    tag_id = db.Column(db.BigInteger, db.ForeignKey("tags.id"), primary_key=True)

    recipe = db.relationship("Recipe", back_populates="tags")
    tag = db.relationship("Tag", back_populates="recipes")
