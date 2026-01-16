from database.db import db

class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    # Veza sa korisnicima (many-to-many preko user_roles)
    users = db.relationship(
        "User",
        secondary="user_roles",
        back_populates="roles"
    )
