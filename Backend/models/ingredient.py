from database.db import db

class Ingredient(db.Model):
    __tablename__ = "ingredients"

    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    # Relacija ka receptima preko RecipeIngredient
    recipes = db.relationship("RecipeIngredient", back_populates="ingredient", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Ingredient {self.name}>"
