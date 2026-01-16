from database.db import db
from datetime import datetime

class Recipe(db.Model):
    __tablename__ = "recipes"

    id = db.Column(db.BigInteger, primary_key=True)
    author_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=False)

    name = db.Column(db.String(255), nullable=False)
    meal_type = db.Column(db.String(50), nullable=False)
    prep_time = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    servings = db.Column(db.Integer, nullable=False)

    image = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # relacije (nije obavezno ali je dobro)
    ratings = db.relationship("RecipeRating", back_populates="recipe", cascade="all, delete-orphan")
    favorites = db.relationship("FavoriteRecipe", back_populates="recipe", cascade="all, delete-orphan")
    comments = db.relationship("RecipeComment", back_populates="recipe", cascade="all, delete-orphan")
    ingredients = db.relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")
    steps = db.relationship("RecipeStep", back_populates="recipe", cascade="all, delete-orphan")
    tags = db.relationship("RecipeTag", back_populates="recipe", cascade="all, delete-orphan")
