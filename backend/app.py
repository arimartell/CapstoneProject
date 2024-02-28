from flask import Flask, render_template, request, redirect, url_for, session
from flask_login import (
    current_user,
    login_required,
    LoginManager,
    login_user,
    logout_user,
)
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit, db_session, select, desc
from models import db, User, Meal, Staple_meal
import re
from datetime import datetime
from email_verif_code import *
import time
import datetime
from datetime import date, datetime

login_manager = LoginManager()
# hpyttps://docs.ponyorm.org/integration_with_flask.html Reference for setting up database

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

# Define a route for the root URL
@app.route("/")
def home():
    # Check if the user is authenticated
    if current_user.is_authenticated:
        # If authenticated, get the username this is for the welcome on the page
        username = current_user.username
    else:
        # If not authenticated, set username to None
        username = None
    return render_template("home.html", username=username)


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
            # Check if it's the user's first time logging in
            if user.last_login is None:
                # Update the last_login field
                user.last_login = datetime.now()
                # Save the changes to the user
                commit()
                # Directs first time users to edit profile before going into meal route, is recurring user direct to home
                return redirect(url_for("profile"))
            else:
                return redirect(url_for("home"))
        else:
            error = "Invalid username or password"
    return render_template("login.html", error=error)


@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form["email"]

        # Check if the email exists in the database
        user = User.get(email=email)
        if user is None:
            error = "Email not found"
            return render_template("forgot_password.html", error=error)

        # Generate verification code
        verification_code = generate_verification_code()

        # Send verification email
        send_verification_email(email, verification_code)

        # Store verification code in session
        session["verification_code"] = verification_code
        session["email"] = email

        return redirect(url_for("verify_code"))

    return render_template("forgot_password.html")


@app.route("/verify-code", methods=["GET", "POST"])
def verify_code():
    if request.method == "POST":
        entered_code = request.form["verification_code"]

        # Succesful entry redirect to reset password
        if session.get("verification_code") == entered_code:
            return redirect(url_for("reset_password"))
        else:
            # Throw error, allow for reentry of code
            error = "Invalid verification code"
            return render_template("verify_code.html", error=error)

    return render_template("verify_code.html")


@app.route("/reset-password", methods=["GET", "POST"])
def reset_password():
    if request.method == "POST":
        new_password = request.form["new_password"]
        confirm_password = request.form["confirm_password"]
        if new_password != confirm_password:
            # Throw error, allow reentry of passwords
            error = "Passwords do not match"
            return render_template("reset_password.html", error=error)

        # Check password complexity
        if not is_password_complex(new_password):
            error = "Password must be at least 8 characters long and contain at least one alphabet letter, one number, and one special character"
            return render_template("reset_password.html", error=error)

        # Update password in the database
        email = session.get("email")
        user = User.get(email=email)
        user.password = generate_password_hash(new_password)
        commit()

        # Clear session data
        session.pop("verification_code", None)
        session.pop("email", None)

        return redirect(url_for("login"))

    return render_template("reset_password.html")


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
        if not is_password_complex(password):
            error = "Password must be at least 8 characters long and contain at least one alphabet letter, one number, and one special character"
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


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


# Used https://www.geeksforgeeks.org/flask-app-routing/ to help understand routing
@app.route("/meal", methods=["GET", "POST"])
@login_required
def meal():
    if request.method == "POST":
    # Ensure fields are not missing
        if "name" not in request.form:
            return "Missing 'name'", 400
        if "calories" not in request.form:
            return "Missing 'calories'", 400
        if "carbs" not in request.form:
            return "Missing 'carbs'", 400
        if "total_fat" not in request.form:
            return "Missing 'total_fat'"
        if "protein" not in request.form:
            return "Missing 'protein'", 400
    # Ensuree fields are not empty
        if request.form["name"] == "":
            return "Invalid 'name'", 400
        if request.form["calories"] == "":
            return "Invalid 'calories'", 400
        if request.form["carbs"] == "":
            return "Invalid 'carbs'", 400
        if request.form["total_fat"] == "":
            return "Invalid 'total_fat'"
        if request.form["protein"] == "":
            return "Invalid 'protein'", 400
        
        # Gets back form data
        name = request.form["name"]
        calories = request.form["calories"]
        carbs = request.form["carbs"]
        total_fat = request.form["total_fat"]
        protein = request.form["protein"]

        # Optional fields
        optional_fields = {}
        optional_field_names = ["sat_fat", "trans_fat", "carbs_fiber", "carbs_sugar", "sodium"]
        for field_name in optional_field_names:
            if field_name in request.form:
                optional_fields[field_name] = int(request.form[field_name])

        new_meal = Meal(
            name=name,
            calories=calories,
            carbs=carbs,
            total_fat=total_fat,
            protein=protein,
            user=current_user,
            **optional_fields  # Unpack optional fields into the Meal constructor
        )


        
        if has_filled_out_profile() == False:
            return "Profile Not filled!", 400
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
    bagel_staple_meal = ["Bagel", 245, 47.9, 1.5, 0, 0.4, 4.02, 6, 10, 0.43, 1]
    chicken_staple_meal = ["Chicken", 198, 0, 4.3, 1.2, 0, 0, 0, 37, 0.089, 120]
    steak_staple_meal = ["Steak", 614, 0, 41, 16, 0, 0, 0, 58, 0.115, 221]
    bread_staple_meal = ["Bread", 72, 13, 0.9, 0.2, 0, 0.7, 1.5, 2.4, 0.132, 1]
    rice_staple_meal = ["Rice", 205, 45, 0.4, 0.1, 0, 0.6, 0.1, 4.3, 0.0016, 158]
    macro_list = [
        egg_staple_meal,
        bagel_staple_meal,
        chicken_staple_meal,
        steak_staple_meal,
        bread_staple_meal,
        rice_staple_meal,
    ]

    # Check if the request is POST
    if request.method == "POST":
        # Gets back form data and parses for blank inputs
        eggs = request.form["Eggs"] if request.form["Eggs"] != "" else 0
        bagel = request.form["Bagel"] if request.form["Bagel"] != "" else 0
        chicken = request.form["Chicken"] if request.form["Chicken"] != "" else 0
        steak = request.form["Steak"] if request.form["Steak"] != "" else 0
        bread = request.form["Bread"] if request.form["Bread"] != "" else 0
        rice = request.form["Rice"] if request.form["Rice"] != "" else 0
        meal_list = [
            int(eggs),
            int(bagel),
            int(chicken),
            int(steak),
            int(bread),
            int(rice),
        ]

        # Create new meal obj to add macro count from each staple item to
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
        for index, value in enumerate(meal_list):
            if value > 0:
                serving_size = value / macro_list[index][10]
                new_meal.calories += macro_list[index][1] * serving_size
                new_meal.carbs += macro_list[index][2] * serving_size
                new_meal.total_fat += macro_list[index][3] * serving_size
                new_meal.sat_fat += macro_list[index][4] * serving_size
                new_meal.trans_fat += macro_list[index][5] * serving_size
                new_meal.carbs_fiber += macro_list[index][6] * serving_size
                new_meal.carbs_sugar += macro_list[index][7] * serving_size
                new_meal.protein += macro_list[index][8] * serving_size
                new_meal.sodium += macro_list[index][9] * serving_size

        # Commit a new meal to database
        commit()
        # Redirect to staple_meal page
        return redirect(url_for("staple_meal"))
    else:
        # if not a POST request direct to staple_meal page template
        return render_template("staple_meal.html")


@app.route("/users")  ### Testing if it creates an account and hashes password
def list_users():
    users = User.select()  # Fetch all users from the database
    return render_template("user_list.html", users=users)


def has_filled_out_profile():
    if User[current_user.id].unit_type == "":
        return False
    if User[current_user.id].sex == "":
        return False
    if User[current_user.id].weight == 0:
        return False
    if User[current_user.id].height == 0:
        return False
    if User[current_user.id].activity_level == "":
        return False
    if User[current_user.id].goal_type == "":
        return False
    # ? Example of guarding a page by checking if a user has filled out their profile with a helper function,
    # ? we can use this for when users try to input into meal page without filling out profile
    # if has_filled_out_profile() == False:
    #     return "Profile Not filled!", 400


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    # Ensure fields are not missing in the request form
    if request.method == "POST":
        if "unittype" not in request.form:
            return "Missing 'unittype'", 400
        if "sex" not in request.form:
            return "Missing 'sex'", 400
        if "weight" not in request.form:
            return "Missing 'weight'", 400
        if "heightfeet" not in request.form:
            return "Missing 'heightfeet'", 400
        if "heightinches" not in request.form:
            return "Missing 'heightinches'", 400
        if "birthday" not in request.form:
            return "Missing 'birthday'", 400
        if "activitylevel" not in request.form:
            return "Missing 'activitylevel'", 400
        if "goaltype" not in request.form:
            return "Missing 'goaltype'", 400
        if "targetweight" not in request.form:
            return "Missing 'targetweight'", 400
    # Ensure fields are not empty in request form
        if request.form["unittype"] == "":
            return "Invalid 'unittype'", 400
        if request.form["sex"] == "":
            return "Invalid 'sex'", 400
        if request.form["weight"] == "":
            return "Invalid 'weight'", 400
        if request.form["heightfeet"] == "":
            return "Invalid 'heightfeet'", 400
        if request.form["heightinches"] == "":
            return "Invalid 'heightinches'", 400
        if request.form["birthday"] == "":
            return "Invalid 'birthday'", 400
        if request.form["activitylevel"] == "":
            return "Invalid 'activitylevel'", 400
        if request.form["goaltype"] == "":
            return "Invalid 'goaltype'", 400
        #Validation so input can only be digits https://docs.python.org/3/library/re.html for regex 
        if not re.match(r"^\d+$", request.form["weight"]):
            return "Invalid weight", 400
        if not re.match(r"^\d+$", request.form["heightfeet"]):
            return "Invalid height feet", 400
        if not re.match(r"^\d+$", request.form["heightinches"]):
            return "Invalid height inches", 400
        if request.form["goaltype"] == "lose":
            if not re.match(r"^\d+$", request.form["targetweight"]):
                return "Invalid target weight", 400
        # Update user's profile information based on form data
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
            if request.form["targetweight"] != "" and not re.match(r"^\d+$", request.form["targetweight"])
            else 0
        )
        User[current_user.id].maintenance_calories = 0

        commit()
        print(request.form)
        # Redirect to the home page after successfully updating profile
        return redirect(url_for("home"))

    print(current_user.username)
    return render_template("profile.html", u=current_user)

@app.route("/biometrics", methods=["GET", "POST"])
@login_required
def biometrics():
    if request.method == "GET":
        #BMR formula male: 66 + (6.23 x lbs) + (12.7 x inch) - (6.8 x yrs)
        #BMR formula female: 655 + (4.3 x lbs) + (4.7 x inch) - (4.7 x yrs)
        #TDEE formula: 1.2 x bmr (sendentary) 1.375 x bmr (light) 1.55 x bmr (moderate) 1.725 x bmr (heavy) 1.9 x bmr (extreme)
        lbs = User[current_user.id].weight 
        inch = User[current_user.id].height
        yrs = date.today().year - User[current_user.id].birthday.date().year  
        exercise = User[current_user.id].activity_level
        sex = User[current_user.id].sex
        if (sex == "Male") :
            bmr = 66 + (6.23 * lbs) + (12.7 * inch) - (6.8 * yrs)
        else :
            bmr = 655 + (4.3 * lbs) + (4.7 * inch) - (4.7 * yrs)
        if exercise == "sedentary":
            tdee = 1.2 * bmr
        elif exercise == "light":
            tdee = 1.375 * bmr
        elif exercise == "moderate":
            tdee = 1.55 * bmr
        elif exercise == "heavy":
            tdee = 1.725 * bmr
        elif exercise == "extreme":
            tdee = 1.9 * bmr
        else :
            tdee = 0
        print(tdee)
        User[current_user.id].maintainence_calories = tdee
        commit()
        print(User[current_user.id].maintenance_calories)
    return render_template("biometrics.html", u=current_user)



# Run the Flask application if this script is executed directly
if __name__ == "__main__":
    app.run()
