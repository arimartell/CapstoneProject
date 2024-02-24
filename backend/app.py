from flask import Flask, render_template, request, redirect, url_for, session
from flask_login import current_user, login_required, LoginManager, login_user
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit, db_session, select, desc
from models import db, User, Meal, Staple_meal
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

g = {}


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
        if (
            not any(char in string.ascii_letters for char in password)
            or not any(char in string.digits for char in password)
            or not any(char in string.punctuation for char in password)
            or len(password) < 8
        ):
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
    
@app.route("/staple_meal", methods=["GET", "POST"])
@login_required
def staple_meal():
    # Create lists of staple meals and their macros
    egg_staple_meal = ["Egg", 66, 0.6, 4.6, 1.3, 0, 0.3, 0.3, 6.4, 0.2, 1]
    bagel_staple_meal = ["Bagel", 245, 47.9, 1.5, 0, 0.4, 4.02, 6, 10, .43, 1] 
    chicken_staple_meal = ["Chicken", 198, 0, 4.3, 1.2, 0, 0, 0, 37, 0.089, 120]
    steak_staple_meal = ["Steak", 614, 0, 41, 16, 0, 0, 0, 58, 0.115, 221]
    bread_staple_meal = ["Bread", 72, 13, 0.9, 0.2, 0, 0.7, 1.5, 2.4, 0.132, 1]
    rice_staple_meal = ["Rice", 205, 45, 0.4, 0.1, 0, 0.6, 0.1, 4.3, 0.0016, 158]
    meal_list = [egg_staple_meal, bagel_staple_meal, chicken_staple_meal, steak_staple_meal, bread_staple_meal, rice_staple_meal]

    # Check if the request is POST
    if request.method == "POST":
        # Gets back form data and parses for blank inputs
        eggs = request.form["Eggs"] if request.form["Eggs"] != '' else 0
        bagel = request.form["Bagel"] if request.form["Bagel"] != '' else 0
        chicken = request.form["Chicken"] if request.form["Chicken"] != '' else 0
        steak = request.form["Steak"] if request.form["Steak"] != '' else 0
        bread = request.form["Bread"] if request.form["Bread"] != '' else 0
        rice = request.form["Rice"] if request.form["Rice"] != '' else 0

        # Create new base meal to add macro count from each staple item to
        new_meal = Meal(
            name="Meal",
            calories=0.0,
            carbs=0.0,
            total_fat=0.0,
            sat_fat=0.0,
            trans_fat=0.0,
            carbs_fiber=0.0,
            carbs_sugar=0.0,
            protein=0.0,
            sodium=0.0,
            user=current_user,
        )
        # Parse through each staple input and extract macros to add to total
        if int(eggs) > 0 :
            serving_size = float(eggs) / egg_staple_meal[10]
            new_meal.calories += egg_staple_meal[1] * serving_size
            new_meal.carbs += egg_staple_meal[2] * serving_size
            new_meal.total_fat += egg_staple_meal[3] * serving_size
            new_meal.sat_fat += egg_staple_meal[4] * serving_size
            new_meal.trans_fat += egg_staple_meal[5] * serving_size
            new_meal.carbs_fiber += egg_staple_meal[6] * serving_size
            new_meal.carbs_sugar += egg_staple_meal[7] * serving_size
            new_meal.protein += egg_staple_meal[8] * serving_size
            new_meal.sodium += egg_staple_meal[9] * serving_size
        
        if int(bagel) > 0 :
            serving_size = float(bagel) / bagel_staple_meal[10]
            new_meal.calories += bagel_staple_meal[1] * serving_size
            new_meal.carbs += bagel_staple_meal[2] * serving_size
            new_meal.total_fat += bagel_staple_meal[3] * serving_size
            new_meal.sat_fat += bagel_staple_meal[4] * serving_size
            new_meal.trans_fat += bagel_staple_meal[5] * serving_size
            new_meal.carbs_fiber += bagel_staple_meal[6] * serving_size
            new_meal.carbs_sugar += bagel_staple_meal[7] * serving_size
            new_meal.protein += bagel_staple_meal[8] * serving_size
            new_meal.sodium += bagel_staple_meal[9] * serving_size
  
        if int(chicken) > 0:
            serving_size = float(chicken) / chicken_staple_meal[10]
            new_meal.calories += chicken_staple_meal[1] * serving_size
            new_meal.carbs += chicken_staple_meal[2] * serving_size
            new_meal.total_fat += chicken_staple_meal[3] * serving_size
            new_meal.sat_fat += chicken_staple_meal[4] * serving_size
            new_meal.trans_fat += chicken_staple_meal[5] * serving_size
            new_meal.carbs_fiber += chicken_staple_meal[6] * serving_size
            new_meal.carbs_sugar += chicken_staple_meal[7] * serving_size
            new_meal.protein += chicken_staple_meal[8] * serving_size
            new_meal.sodium += chicken_staple_meal[9] * serving_size

        if int(steak) > 0:
            serving_size = float(steak) / steak_staple_meal[10]
            new_meal.calories += steak_staple_meal[1] * serving_size
            new_meal.carbs += steak_staple_meal[2] * serving_size
            new_meal.total_fat += steak_staple_meal[3] * serving_size
            new_meal.sat_fat += steak_staple_meal[4] * serving_size
            new_meal.trans_fat += steak_staple_meal[5] * serving_size
            new_meal.carbs_fiber += steak_staple_meal[6] * serving_size
            new_meal.carbs_sugar += steak_staple_meal[7] * serving_size
            new_meal.protein += steak_staple_meal[8] * serving_size
            new_meal.sodium += steak_staple_meal[9] * serving_size

        if int(bread) > 0:
            serving_size = float(bread) / bread_staple_meal[10]
            new_meal.calories += bread_staple_meal[1] * serving_size
            new_meal.carbs += bread_staple_meal[2] * serving_size
            new_meal.total_fat += bread_staple_meal[3] * serving_size
            new_meal.sat_fat += bread_staple_meal[4] * serving_size
            new_meal.trans_fat += bread_staple_meal[5] * serving_size
            new_meal.carbs_fiber += bread_staple_meal[6] * serving_size
            new_meal.carbs_sugar += bread_staple_meal[7] * serving_size
            new_meal.protein += bread_staple_meal[8] * serving_size
            new_meal.sodium += bread_staple_meal[9] * serving_size

        if int(rice) > 0:
            serving_size = float(rice) / rice_staple_meal[10]
            new_meal.calories += rice_staple_meal[1] * serving_size
            new_meal.carbs += rice_staple_meal[2] * serving_size
            new_meal.total_fat += rice_staple_meal[3] * serving_size
            new_meal.sat_fat += rice_staple_meal[4] * serving_size
            new_meal.trans_fat += rice_staple_meal[5] * serving_size
            new_meal.carbs_fiber += rice_staple_meal[6] * serving_size
            new_meal.carbs_sugar += rice_staple_meal[7] * serving_size
            new_meal.protein += rice_staple_meal[8] * serving_size
            new_meal.sodium += rice_staple_meal[9] * serving_size


        # Commit a new meal to database
        commit()
        # Redirect to staple_meal page
        return redirect(url_for("staple_meal"))
    else:
        # if not a POST request direct to home page template
        return render_template("home.html") 


@app.route("/users")  ### Testing if it creates an account and hashes password
def list_users():
    users = User.select()  # Fetch all users from the database
    return render_template("user_list.html", users=users)


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    if request.method == "POST":
        # TODO: Validations for fields!
        User[current_user.id].unit_type = request.form["unittype"]
        User[current_user.id].sex = request.form["sex"]
        User[current_user.id].weight = request.form["weight"]
        h = int(request.form["heightfeet"])
        User[current_user.id].height = int(request.form["heightinches"]) + 12 * h
        User[current_user.id].birthday = request.form["birthday"]
        User[current_user.id].activity_level = request.form["activitylevel"]
        User[current_user.id].goal_type = request.form["goaltype"]
        User[current_user.id].goal_weight = (
            int(request.form["targetweight"])
            if request.form["targetweight"] != ""
            else 0
        )

        commit()
        print(request.form)
    print(current_user.username)
    return render_template("profile.html", u=current_user)


# Run the Flask application if this script is executed directly
if __name__ == "__main__":
    app.run()
