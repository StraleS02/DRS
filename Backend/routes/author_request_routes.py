from flask import Blueprint, request, jsonify
from auth.jwt_middleware import jwt_required
from models.author_request import AuthorRequest
from models.user import User
from models.role import Role
from database.db import db
from datetime import datetime

# Za websocket
from services.socketio_server import socketio

# Za mejl
from services.email_service import send_email

author_request_bp = Blueprint("author_request", __name__)

# ========================
# Reader šalje zahtev za author
# ========================
@author_request_bp.route("/api/author_request", methods=["POST"])
@jwt_required
def request_author():
    user_id = request.user["user_id"]
    role = request.user["role"]

    if role != "reader":
        return jsonify({"error": "Only readers can request author role"}), 403

    # Provera da li već postoji pending zahtev
    existing = AuthorRequest.query.filter_by(user_id=user_id, status="pending").first()
    if existing:
        return jsonify({"error": "You already have a pending request"}), 400

    new_request = AuthorRequest(user_id=user_id)
    db.session.add(new_request)
    db.session.commit()

    # Emit na websocket da admin vidi novi zahtev
    socketio.emit(
        "new_author_request",
        {"request_id": new_request.id, "user_id": user_id}
    )

    return jsonify({"message": "Author request sent"}), 201

# ========================
# Admin vidi sve pending zahteve
# ========================
@author_request_bp.route("/api/admin/author_requests", methods=["GET"])
@jwt_required
def list_author_requests():
    if request.user.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    requests = AuthorRequest.query.filter_by(status="pending").all()
    output = []
    for r in requests:
        output.append({
            "id": r.id,
            "user_id": r.user_id,
            "user_email": r.user.email,
            "created_at": r.created_at.isoformat()
        })

    return jsonify(output), 200

# ========================
# Admin odobrava ili odbija zahtev
# ========================
@author_request_bp.route("/api/admin/author_requests/<int:request_id>", methods=["POST"])
@jwt_required
def decide_author_request(request_id):
    if request.user.get("role") != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.json
    decision = data.get("decision")  # "approved" ili "rejected"
    reason = data.get("rejection_reason")  # opcionalno

    if decision not in ["approved", "rejected"]:
        return jsonify({"error": "Invalid decision"}), 400

    req = AuthorRequest.query.get(request_id)
    if not req or req.status != "pending":
        return jsonify({"error": "Request not found or already decided"}), 404

    req.status = decision
    req.decided_at = datetime.utcnow()
    req.rejection_reason = reason if decision == "rejected" else None

    # Ako je odobreno, promeni rolu korisnika
    if decision == "approved":
        user = User.query.get(req.user_id)

        # Dodaj samo author rolu (ne briše druge)
        author_role = Role.query.filter_by(name="author").first()
        if not author_role:
            author_role = Role(name="author")
            db.session.add(author_role)
            db.session.commit()

        #if author_role not in user.roles:
        user.roles.clear()
        user.roles.append(author_role)

    db.session.commit()

    # Pošalji mejl korisniku
    user_email = req.user.email
    if decision == "approved":
        send_email(
            user_email,
            "Author Request Approved",
            "Congratulations! Your request to become an author has been approved."
        )
    else:
        send_email(
            user_email,
            "Author Request Rejected",
            f"Unfortunately, your request was rejected. Reason: {reason if reason else 'No reason provided'}"
        )

    # Emit na websocket
    socketio.emit(
        "author_request_decided",
        {"request_id": request_id, "decision": decision, "user_id": req.user_id}
    )

    return jsonify({"message": f"Request {decision}"}), 200
