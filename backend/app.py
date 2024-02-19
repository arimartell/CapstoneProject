from flask import Flask, render_template, request, redirect, url_for, session
from flask_login import current_user, login_required, LoginManager, login_user
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit
from models import db, User, Meal
import re
import string

login_manager = LoginManager()
# https://docs.ponyorm.org/integration_with_flask.html Reference for setting up database

# Flask app instance
app = Flask(__name__)
# Config the login manager within the Flask app
login_manager.init_app(app)
# Config settings for Flask app
app.config.update(
    dict(
        DEBUG=True,
        SECRET_KEY="some secret blah blah",
        PONY={
            "provider": "sqlite",
            "filename": "main.db3",
            "create_db": True,
        },
    )
)


# Pony ORM binded with Flask app using config settings
db.bind(**app.config["PONY"])

# Create map between entities and database tables, create tables if it doesn't exist
db.generate_mapping(create_tables=True)

Pony(app)


# Define a route for the root URL
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        login_identifier = request.form["login_identifier"]
        password = request.form["password"]
        
        # Check if login_identifier is email or username
        user = User.get(email=login_identifier) or User.get(username=login_identifier)
        
        if user and check_password_hash(user.password, password):
            # Store user ID in session
            session["user_id"] = user.id
            login_user(user)
            return redirect(url_for("home"))
        else:
            error = "Invalid username or password"
    return render_template("login.html", error=error)

@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form["email"]
    return render_template("forgot_password.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    error = None
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        confirm_email = request.form["confirm_email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]
        
        # Check if email and confirm email fields match
        if email != confirm_email:
            error = "Emails do not match"
            return render_template("signup.html", error=error)

        # Check if password and confirm password fields match
        if password != confirm_password:
            error = "Passwords do not match"
            return render_template("signup.html", error=error)

        # Check if email exists in database
        existing_email = User.get(email=email)
        if existing_email:
            error = "Email already exists"
            return render_template("signup.html", error=error)

        # Check if username exists in database
        existing_user = User.get(username=username)
        if existing_user:
            error = "Username already exists"
            return render_template("signup.html", error=error)

        # Check if email is valid using regex
        # Copied regex from https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
            error = "Invalid email address"
            return render_template("signup.html", error=error)
        
        # Check password complexity
        if (not any(char in string.ascii_letters for char in password) or
            not any(char in string.digits for char in password) or
            not any(char in string.punctuation for char in password) or
            len(password) < 8):
            error = "Password must be atleast 8 characters long and contain at least one alphabet letter, one number, and one special character"
            return render_template("signup.html", error=error)

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create a new user object
        user = User(username=username, email=email, password=hashed_password)

        # Commit changes to the database
        commit()
        
        # Redirect to login page after successful signup
        return redirect(url_for("login"))

    # Render the signup template for GET requests
    return render_template("signup.html")


# User session management for Flask https://flask-login.readthedocs.io/en/latest/


@login_manager.user_loader
def load_user(user_id):
    return db.User.get(id=user_id)


# Used https://www.geeksforgeeks.org/flask-app-routing/ to help understand routing
@app.route("/meal", methods=["GET", "POST"])
@login_required
def meal():
    # Check if the request is POST
    if request.method == "POST":
        # Gets back form data
        name = request.form["name"]
        calories = request.form["calories"]
        carbs = request.form["carbs"]
        total_fat = request.form["total_fat"]
        sat_fat = request.form["sat_fat"]
        trans_fat = request.form["trans_fat"]
        carbs_fiber = request.form["carbs_fiber"]
        carbs_sugar = request.form["carbs_sugar"]
        protein = request.form["protein"]
        sodium = request.form["sodium"]

        # Meal object based on form data
        new_meal = Meal(
            name=name,
            calories=int(calories),
            carbs=int(carbs),
            total_fat=int(total_fat),
            sat_fat=int(sat_fat),
            trans_fat=int(trans_fat),
            carbs_fiber=int(carbs_fiber),
            carbs_sugar=int(carbs_sugar),
            protein=int(protein),
            sodium=int(sodium),
            user=current_user,
        )
        # Commit a new meal to database
        commit()
        # Redirect to meal page
        return redirect(url_for("meal"))
    else:
        # if not a POST request direct to meal page template
        return render_template("meal.html")


@app.route("/users")  ### Testing if it creates an account and hashes password
def list_users():
    users = User.select()  # Fetch all users from the database
    return render_template("user_list.html", users=users)


# Run the Flask application if this script is executed directly
if __name__ == "__main__":
    app.run(debug=True)
