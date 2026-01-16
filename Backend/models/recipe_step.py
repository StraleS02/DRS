from database.db import db

class RecipeStep(db.Model):
    __tablename__ = "recipe_steps"

    id = db.Column(db.BigInteger, primary_key=True)
    recipe_id = db.Column(db.BigInteger, db.ForeignKey("recipes.id"), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)

    recipe = db.relationship("Recipe", back_populates="steps")
