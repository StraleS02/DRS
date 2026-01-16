from database.db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.BigInteger, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    country = db.Column(db.String(100))
    street = db.Column(db.String(150))
    street_number = db.Column(db.String(20))
    profile_image = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacije (ako želiš kasnije koristiti ORM za joinove)
    roles = db.relationship("Role", secondary="user_roles", back_populates="users")
    favorites = db.relationship("FavoriteRecipe", back_populates="user", cascade="all, delete-orphan")
    ratings = db.relationship("RecipeRating", back_populates="user", cascade="all, delete-orphan")
    comments = db.relationship("RecipeComment", back_populates="user", cascade="all, delete-orphan")
    author_requests = db.relationship("AuthorRequest", back_populates="user", cascade="all, delete-orphan"
)

    def __repr__(self):
        return f"<User {self.id} - {self.email}>"
