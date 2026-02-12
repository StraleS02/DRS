from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.recipe_routes import recipe_bp
from routes.admin_routes import admin_bp
from routes.user_routes import user_bp
from routes.recipe_interaction_routes import interaction_bp
from routes.author_request_routes import author_request_bp
from routes.author_routes import author_bp
from database.db import db
from services.socketio_server import socketio
import os

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", 5432)

app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

socketio.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(recipe_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(user_bp)
app.register_blueprint(interaction_bp)
app.register_blueprint(author_request_bp)
app.register_blueprint(author_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
