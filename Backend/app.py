from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.recipe_routes import recipe_bp
from routes.admin_routes import admin_bp
from routes.user_routes import user_bp
from routes.recipe_interaction_routes import interaction_bp
from routes.author_request_routes import author_request_bp
from database.db import db
from services.socketio_server import socketio

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:admin@localhost:5432/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 🔌 INIT ORM
db.init_app(app)

socketio.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(recipe_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(user_bp)
app.register_blueprint(interaction_bp)
app.register_blueprint(author_request_bp)

if __name__ == "__main__":
    app.run(debug=True)
