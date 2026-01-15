from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.recipe_routes import recipe_bp
from routes.admin_routes import admin_bp

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(recipe_bp)
app.register_blueprint(admin_bp)

if __name__ == "__main__":
    app.run(debug=True)
