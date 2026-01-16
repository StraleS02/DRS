from database.db import db
from datetime import datetime

class RecipeRating(db.Model):
    __tablename__ = "ratings"

    user_id = db.Column(
        db.BigInteger,
        db.ForeignKey("users.id"),
        primary_key=True
    )

    recipe_id = db.Column(
        db.BigInteger,
        db.ForeignKey("recipes.id"),
        primary_key=True
    )

    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="ratings")
    recipe = db.relationship("Recipe", back_populates="ratings")
