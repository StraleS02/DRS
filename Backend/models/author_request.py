# models/author_request.py
from database.db import db
from datetime import datetime

class AuthorRequest(db.Model):
    __tablename__ = "author_requests"

    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=False)
    
    status = db.Column(
        db.String(20), 
        nullable=False, 
        default="pending"
    )  # pending, approved, rejected

    rejection_reason = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    decided_at = db.Column(db.DateTime, nullable=True)

    # Relacija sa User
    user = db.relationship("User", back_populates="author_requests")
