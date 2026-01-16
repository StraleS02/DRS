from database.db import db

class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    recipes = db.relationship("RecipeTag", back_populates="tag", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Tag {self.name}>"
