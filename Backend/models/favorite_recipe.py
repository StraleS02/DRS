from database.db import db

class FavoriteRecipe(db.Model):
    __tablename__ = "favorites"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), primary_key=True)

    user = db.relationship("User", back_populates="favorites")
    recipe = db.relationship("Recipe", back_populates="favorites")

    __table_args__ = (
        db.UniqueConstraint("user_id", "recipe_id", name="unique_favorite"),
    )
