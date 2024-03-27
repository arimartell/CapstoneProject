from flask import Flask, jsonify, request, redirect, url_for
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit
from models import db, User
import string
import re

app = Flask(__name__)
app.secret_key = "some secret blah blah"
app.config["JWT_SECRET_KEY"] = "jwt_secret_key"
jwt = JWTManager(app)
db.bind(provider="sqlite", filename="main.db3", create_db=True)
db.generate_mapping(create_tables=True)
Pony(app)

def is_password_complex(password: string) -> bool:
    """
    Check if the password meets complexity requirements. The requiremnts are it must contain:
    atleast one letter, one number and one special character.

    Parameters:
    password (string): The inputted password from user.

    Returns:
    bool: True or False depending on if password meets complexity requirements
    """
    if (
        not any(char in string.ascii_letters for char in password)
        or not any(char in string.digits for char in password)
        or not any(char in string.punctuation for char in password)
        or len(password) < 8
    ):
        return False
    return True

@app.route("/")
def home():
    return jsonify(message="Welcome to the home page")

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    login_identifier = data.get("login_identifier")
    password = data.get("password")

    # Check if login_identifier is email or username
    user = User.get(email=login_identifier) or User.get(username=login_identifier)

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.username)
    return jsonify(access_token=access_token), 200

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    confirm_email = data.get("confirm_email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    # Check if any required field is missing
    if not all([username, email, confirm_email, password, confirm_password]):
        return jsonify({"message": "All fields (username, email, confirm_email, password, confirm_password) are required"}), 400

    # Check if username exists in database
    existing_user = User.get(username=username)
    if existing_user:
        return jsonify({"message": "Username already exists"}), 400

    # Check if email exists in database
    existing_email = User.get(email=email)
    if existing_email:
        return jsonify({"message": "Email already exists"}), 400

    # Check if email is valid
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
        return jsonify({"message": "Invalid email address"}), 400

    # Check if email and confirm email fields match
    if email != confirm_email:
        return jsonify({"message": "Emails do not match"}), 400

    # Check if password and confirm password fields match
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    # Check password complexity
    if not is_password_complex(password):
        return jsonify({"message": "Password must be at least 8 characters long and contain at least one alphabet letter, one number, and one special character"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)
    # Create a new user object
    user = User(username=username, email=email, password=hashed_password)
    # Commit user to database
    commit()

    access_token = create_access_token(identity=user.username)
    return jsonify(access_token=access_token), 200


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # Remove the JWT cookies
    resp = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(resp)
    return resp, 200

# To check which user is currently logged in via access token when user logs in
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == "__main__":
    app.run(debug=True)
