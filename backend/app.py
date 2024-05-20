from flask import Flask, jsonify, request, session, json, make_response
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
)
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit
from models import db, User, Meal, Staple_meal
import string
import requests
from datetime import timedelta, datetime, date
from email_verif_code import *
from calculations import *
import re

app = Flask(__name__)
CORS(app)
app.secret_key = "some secret blah blah"
app.config["JWT_SECRET_KEY"] = "jwt_secret_key"
# Set the expiration time for access tokens (1 hour)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
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


def has_filled_out_profile(current_user):
    if not current_user:
        return False

    if (
        current_user.unit_type == ""
        or current_user.sex == ""
        or current_user.weight == 0
        or current_user.height == 0
        or current_user.activity_level == ""
        or current_user.goal_type == ""
    ):
        return False
    else:
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
        return (
            jsonify(
                {
                    "message": "All fields (username, email, confirm_email, password, confirm_password) are required"
                }
            ),
            400,
        )

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
        return (
            jsonify(
                {
                    "message": "Password must be at least 8 characters long and contain at least one alphabet letter, one number, and one special character"
                }
            ),
            400,
        )

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
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    # Check if the email exists in the database
    user = User.get(email=email)
    if not user:
        return jsonify({"message": "Email not found"}), 404

    # Generate verification code
    verification_code = generate_verification_code()

    # Send verification email
    send_verification_email(email, verification_code)

    # Store verification code and email in session
    session["verification_code"] = verification_code
    session["email"] = email

    # Return success message
    return jsonify({"message": "Verification code sent successfully"}), 200


@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    verification_code = data.get("verification_code")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    # Retrieve verification code and email from session
    stored_code = session.get("verification_code")
    stored_email = session.get("email")

    # Check if entered code matches the stored verification code
    if verification_code != stored_code:
        return jsonify({"message": "Invalid verification code"}), 401

    # Check if new password matches the confirm password
    if new_password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    # Check password complexity
    if not is_password_complex(new_password):
        return jsonify({"message": "Password must meet complexity requirements"}), 400

    # Retrieve user from database
    user = User.get(email=stored_email)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Update password in the database
    user.password = generate_password_hash(new_password)
    commit()  # Commit changes to the database

    # Clear session data
    session.pop("verification_code", None)
    session.pop("email", None)

    # Return success message
    return jsonify({"message": "Password reset successful"}), 200


@app.route("/profile", methods=["GET", "POST"])
@jwt_required()
def profile():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)

    if request.method == "POST":
        data = request.get_json()

        # Ensure all required fields are present in the request data
        required_fields = [
            "sex",
            "weight",
            "heightfeet",
            "heightinches",
            "birthday",
            "activitylevel",
            "diettype",
            "goaltype",
        ]

        # Add targetweight to required fields if goaltype is weight loss or gain
        if data.get("goaltype") in ["loss", "gain"]:
            required_fields.append("targetweight")

        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"Missing {field}"}), 400

        # Ensure none of the fields are empty
        for field, value in data.items():
            if value == "":
                return jsonify({"message": f"Invalid {field}"}), 400

        # Validate certain fields using regex
        if not re.match(r"^\d+$", data["weight"]):
            return jsonify({"message": "Invalid weight"}), 400
        if not re.match(r"^\d+$", data["heightfeet"]):
            return jsonify({"message": "Invalid height feet"}), 400
        if not re.match(r"^\d+$", data["heightinches"]):
            return jsonify({"message": "Invalid height inches"}), 400
        if data["goaltype"] in ["loss", "gain"] and not re.match(r"^\d+$", data["targetweight"]):
            return jsonify({"message": "Invalid target weight"}), 400

        # Convert target weight to integer if present
        true_tweight = int(data.get("targetweight", data["weight"]))

        # Update user's profile information based on form data
        current_user.sex = data["sex"]
        current_user.weight = data["weight"]
        h = int(data["heightfeet"])
        current_user.height = int(data["heightinches"]) + 12 * h
        current_user.birthday = data["birthday"]
        current_user.activity_level = data["activitylevel"]
        current_user.goal_type = data["goaltype"]
        current_user.goal_weight = true_tweight
        current_user.diet_type = data["diettype"]

        # Calculate age
        birthday = datetime.strptime(data["birthday"], "%Y-%m-%d")
        today = datetime.today()
        age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
        current_user.age = age

        # Calculate BMR (Basal Metabolic Rate)
        bmr = calculate_bmr(current_user.weight, current_user.height, current_user.age, current_user.sex)
        current_user.bmr = bmr

        # Calculate TDEE (Total Daily Energy Expenditure)
        tdee = calculate_tdee(bmr, current_user.activity_level)
        current_user.tdee = tdee

        # Check if target weight is greater than current weight when goaltype is loss
        if data["goaltype"] == "loss" and true_tweight >= int(data["weight"]):
            return jsonify({"message": "Target weight must be less than current weight for weight loss goal"}), 400

        # Check if target weight is less than current weight when goaltype is gain
        if data["goaltype"] == "gain" and true_tweight <= int(data["weight"]):
            return jsonify({"message": "Target weight must be greater than current weight for weight gain goal"}), 400

        # Calculate BMI based on target weight and current height
        target_bmi = calculate_bmi(current_user.height, true_tweight)

        # Classify BMI (target weight not current)
        target_bmi_category = classify_bmi(target_bmi)

        # Alert user based on BMI category for weight loss or gain goal
        if data["goaltype"] in ["loss", "gain"]:
            if target_bmi_category == "Underweight":
                return jsonify({"message": "Increase the target weight to reach a healthy BMI"}), 400
            elif target_bmi_category in ["Overweight", "Obesity"]:
                return jsonify({"message": "Decrease the target weight to reach a healthy BMI"}), 400
            
        if data["goaltype"] == "maintenance":
            current_bmi = calculate_bmi(current_user.height, current_user.weight)
            current_bmi_category = classify_bmi(current_bmi)
            if current_bmi_category == "Underweight":
                return jsonify({"message": "Current BMI is Underweight, Choose Weight Gain for Healthy BMI"}), 400
            elif current_bmi_category in ["Overweight", "Obesity"]:
                return jsonify({"message": "Current BMI is Overweight, Choose Weight Loss for Healthy BMI"}), 400

        # Update weeks_to_goal for weight loss or gain goals
        if data["goaltype"] in ["loss", "gain"]:
            weeks_to_goal = calculate_goal_weight_weeks(current_user.weight, true_tweight, data["goaltype"])
            current_user.weeks_to_goal = weeks_to_goal
        else:
            current_user.weeks_to_goal = None

        commit()

        # Redirect to the home page after successfully updating profile
        return jsonify({"message": "Profile updated successfully"}), 200

    # Handle GET request to retrieve the user's profile
    # Grab user attributes to use in calculations
    weight = current_user.weight
    goal_weight = current_user.goal_weight
    tdee = current_user.tdee   # TDEE (Total Daily Energy Expenditure)
    goal_type = current_user.goal_type

    

    weigh_in_rate_one_week = weight_loss_scalar(current_user, 7)
    weigh_in_rate_one_month = weight_loss_scalar(current_user, 30)
    weigh_in_rate_three_months = weight_loss_scalar(current_user, 90)

    if goal_type in ["loss", "gain"]:
        # Calculate weeks needed to reach weight goal
        weeks_to_goal = calculate_goal_weight_weeks(weight, goal_weight, goal_type)

        # Calculate average daily calories under the weight loss plan
        daily_calories = calculate_daily_calories(tdee, goal_type)

        # Calculate macronutrient ratios for each weight loss goal
        diet_type = current_user.diet_type
        carbs_calories_1lb, fats_calories_1lb, protein_calories_1lb, carbs_percentage, fats_percentage, proteins_percentage = (
            calculate_macronutrient_ratios(daily_calories, diet_type)
        )

        # Calculate weights for each week based on weight loss rates
        current_weight = weight
        if goal_type == "loss":
            goal_weights_1lb = [current_weight - i for i in range(weeks_to_goal + 1)]
            max_weeks = weeks_to_goal + 1
            x_labels = [f"Week {i}" for i in range(1, max_weeks)]  # Start from Week 1
        elif goal_type == "gain":
            goal_weights_1lb = [current_weight + i for i in range(weeks_to_goal + 1)]
            max_weeks = weeks_to_goal + 1
            x_labels = [f"Week {i}" for i in range(1, max_weeks)]  # Start from Week 1
    else:
        # For maintenance, calculate macronutrient ratios and daily calories
        daily_calories = calculate_daily_calories(tdee, goal_type)
        diet_type = current_user.diet_type
        carbs_calories_1lb, fats_calories_1lb, protein_calories_1lb, carbs_percentage, fats_percentage, proteins_percentage = (
            calculate_macronutrient_ratios(daily_calories, diet_type)
        )
        goal_weights_1lb = None
        x_labels = None
        weeks_to_goal = None

    return (
        jsonify(
            {
                "sex": current_user.sex,
                "weight": current_user.weight,
                "heightfeet": current_user.height // 12,
                "heightinches": current_user.height % 12,
                "birthday": current_user.birthday,
                "age": current_user.age,
                "activitylevel": current_user.activity_level,
                "diettype": current_user.diet_type,
                "goaltype": current_user.goal_type,
                "targetweight": current_user.goal_weight,
                "bmr": current_user.bmr,
                "tdee": current_user.tdee,
                "user": current_username,
                "weeks_to_goal": weeks_to_goal,
                "daily_calories": daily_calories,
                "goal_weights_1lb": goal_weights_1lb,
                "x_labels": x_labels,
                "carbs_calories_1lb": carbs_calories_1lb,
                "fats_calories_1lb": fats_calories_1lb,
                "protein_calories_1lb": protein_calories_1lb,
                "suggested_daily_calorie_intake": round(daily_calories, 2),
                "carbs_percentage": carbs_percentage,
                "fats_percentage": fats_percentage,
                "proteins_percentage": proteins_percentage,
                "weight_in_rate_one_week": weigh_in_rate_one_week,
                "weight_in_rate_one_month": weigh_in_rate_one_month,
                "weight_in_rate_three_months": weigh_in_rate_three_months,

            }
        ),
        200,
    )



@app.route("/setweeklyweights", methods=["GET", "POST"])
@jwt_required()
def set_weekly_weights():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)

    if request.method == "GET":
        existing_weights = json.loads(current_user.weekly_weight)
        weeks_to_goal = current_user.weeks_to_goal
        return jsonify({"weekly_weights": existing_weights, "weeks_to_goal": weeks_to_goal}), 200

    data = request.get_json()

    if not data.get("weekly_weights"):
        return jsonify({"message": "Missing weekly_weights"}), 400

    weekly_weights = data["weekly_weights"]
    if not isinstance(weekly_weights, list):
        return jsonify({"message": "Invalid format for weekly_weights"}), 400

    # Validate weights
    for weight in weekly_weights:
        if not isinstance(weight, (int, float)) or weight <= 0:
            return jsonify({"message": "All weights must be positive numbers"}), 400

    # Clear existing weights before adding new ones
    current_user.weekly_weight = json.dumps([])
    updated_weights = weekly_weights
    current_user.weekly_weight = json.dumps(updated_weights)
    commit()

    return jsonify({"message": "Weekly weights updated successfully"}), 200



@app.route("/dashboard", methods=["POST"])
@jwt_required()
def dashboard():

    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)
    meals_today = []

    if current_user.diet_type == "regular":
        current_user.protein_goal = current_user.weight * 0.35
    elif (
        current_user.diet_type == "ketogenic"
        or current_user.diet_type == "low_fat"
        or current_user.diet_type == "low_carb"
    ):
        current_user.protein_goal = current_user.weight * 0.8
    elif current_user.diet_type == "high_protein":
        current_user.protein_goal = current_user.weight

    cals_left = total_cals = User[current_user.id].tdee
    protein_left = total_protein = User[current_user.id].protein_goal

    user_meals = Meal.select(lambda m: m.user == current_user)
    for m in user_meals:
        print(m.date.date())
        if m.date.date() == datetime.now().date():
            meals_today.append(m)
    for m in meals_today:
        cals_left -= m.calories
        protein_left -= m.protein
    return (
        jsonify(
            {
                "cals_left": cals_left,
                "protein_left": protein_left,
                "total_cals": total_cals,
                "total_protein": total_protein,
            }
        ),
        200,
    )


@app.route("/meal", methods=["POST", "GET"])
@jwt_required()
def add_meal():
    if request.method == "POST":
        current_username = get_jwt_identity()
        current_user = User.get(username=current_username)

        data = request.get_json()

        # Ensure fields are not missing
        required_fields = ["name", "calories", "carbs", "total_fat", "protein"]
        for field in required_fields:
            if field not in data or data[field] in (None, ""):
                return jsonify({"message": f"Please fill out all required fields"}), 400

        # Validation so input can only be digits for all fields except name
        numeric_fields = ["calories", "carbs", "total_fat", "protein"]
        for field in numeric_fields:
            try:
                data[field] = float(data[field])
            except ValueError:
                return jsonify({"message": "Please enter a valid number"}), 400

        # Optional fields based on model
        optional_fields = {}
        optional_field_names = [
            "sat_fat",
            "trans_fat",
            "carbs_fiber",
            "carbs_sugar",
            "sodium",
        ]
        for field_name in optional_field_names:
            if field_name in data and data[field_name] != "":
                optional_fields[field_name] = data[field_name]

        # Create a new meal object
        new_meal = Meal(
            name=data["name"],
            calories=float(data["calories"]),
            carbs=float(data["carbs"]),
            total_fat=float(data["total_fat"]),
            protein=float(data["protein"]),
            user=current_user,
            date=datetime.now(),
            **optional_fields,
        )

        # Check if the user has filled out their profile
        if not has_filled_out_profile(current_user):
            return jsonify({"message": "Profile not filled out"}), 400

        # Commit the new meal to the database
        db.commit()

        return jsonify({"message": "Meal added successfully"}), 201
    else:
        current_username = get_jwt_identity()
        current_user = User.get(username=current_username)
        recent_meals_query = Meal.select(lambda m: m.user == current_user)
        recent_meals = recent_meals_query[:6]

        def serialize_except(meal):
            return {
                "name": meal.name,
                "calories": meal.calories,
                "carbs": meal.carbs,
                "total_fat": meal.total_fat,
                "sat_fat": meal.sat_fat,
                "trans_fat": meal.trans_fat,
                "carbs_fiber": meal.carbs_fiber,
                "carbs_sugar": meal.carbs_sugar,
                "protein": meal.protein,
                "sodium": meal.sodium,
            }

        # object_like_recent_meals = []
        # for meal in recent_meals:
        #     object_like_recent_meals.append(dict(zip(['name', 'calories', 'carbs'], meal)))
        # print(recent_meals)

        meal_data = [serialize_except(meal) for meal in recent_meals]

        # if not a POST request direct to meal page template
        return jsonify(meal_data)
        # return jsonify({})
        # return render_template("meal.html", recent=recent_meals)


@app.route("/staple_meal", methods=["POST"])
@jwt_required()
def staple_meal():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)

    # Create lists of staple meals and their macros
    macro_list = [
        ["Egg", 66, 0.6, 4.6, 1.3, 0, 0.3, 0.3, 6.4, 0.2, 1],
        ["Bagel", 245, 47.9, 1.5, 0, 0.4, 4.02, 6, 10, 0.43, 1],
        ["Chicken", 198, 0, 4.3, 1.2, 0, 0, 0, 37, 0.089, 120],
        ["Steak", 614, 0, 41, 16, 0, 0, 0, 58, 0.115, 221],
        ["Bread", 72, 13, 0.9, 0.2, 0, 0.7, 1.5, 2.4, 0.132, 1],
        ["Rice", 205, 45, 0.4, 0.1, 0, 0.6, 0.1, 4.3, 0.0016, 158],
    ]

    # Get data from the request
    data = request.get_json()

    def get_int_value(key):
        """Convert the value to integer, default to 0 if not a valid number."""
        return int(data.get(key, 0)) if data.get(key, "").isdigit() else 0

    # Parse meal data from request
    meal_list = [
        get_int_value("eggs"),
        get_int_value("bagel"),
        get_int_value("chicken"),
        get_int_value("steak"),
        get_int_value("bread"),
        get_int_value("rice"),
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
        date=datetime.now(),
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

    # Commit the new meal to the database
    db.commit()

    return jsonify({"message": "Staple meal added successfully"}), 201


@app.route("/recipe", methods=["POST"])
@jwt_required()
def recipe():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    ingredients_list = data.get("ingredients", "").split("\n")

    # Define the URL and headers
    url = "https://api.edamam.com/api/nutrition-details"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
    }

    # Define the payload data
    data = {
        "title": "meal",
        "ingr": ingredients_list,
        "url": "",
        "summary": "",
        "yield": "",
        "time": "",
        "img": "",
        "prep": "",
    }

    # Specify the app_id and app_key in the URL parameters
    params = {"app_id": "e1148ade", "app_key": "edb8b2c1e8f7356ab2db349a02ccc13a"}

    # Send the POST request
    response = requests.post(url, headers=headers, params=params, json=data)
    # Check if the request was successful
    if response.ok:
        nutrients = response.json().get("totalNutrients", {})
        return jsonify({"nutrients": nutrients}), 200
    else:
        # Print the error message if the request failed
        print(f"Error: {response.status_code} - {response.reason}")
        return jsonify({"error": "Recipe unknown"}), 500


@app.route("/lookup", methods=["POST"])
# jwt_required breaks this?
def lookup_food():
    data = request.get_json()
    ingredient = data.get("ingr")
    if not ingredient:
        return jsonify({"error": "Missing ingredient"}), 400

    url = f"https://api.edamam.com/api/food-database/v2/parser?app_id=dca363b5&app_key=6b400d1db41322ce8fc5cd0e892b418d&ingr={ingredient}&nutrition-type=cooking"
    response = requests.get(url, headers={"accept": "application/json"})

    if response.ok:
        return jsonify(response.json()), 200
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code


@app.route("/badge/firstmeal", methods=["GET"])
@jwt_required()
def badge_firstmeal():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)
    recent_meals_query = Meal.select(lambda m: m.user == current_user)
    recent_meals = recent_meals_query[:]
    if len(recent_meals) > 0:
        return jsonify({"has_badge": True})
    else:
        return jsonify({"has_badge": False})


@app.route("/todaysmeals", methods=["GET"])
@jwt_required()
def todays_meals():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)
    today = datetime.now().date()
    recent_meals_query = Meal.select(
        lambda m: m.user == current_user and m.date.date() == today
    )
    recent_meals = recent_meals_query[:]

    def serialize_except(meal):
        return {
            "id": meal.id,
            "name": meal.name,
            "calories": meal.calories,
            "carbs": meal.carbs,
            "total_fat": meal.total_fat,
            "sat_fat": meal.sat_fat,
            "trans_fat": meal.trans_fat,
            "carbs_fiber": meal.carbs_fiber,
            "carbs_sugar": meal.carbs_sugar,
            "protein": meal.protein,
            "sodium": meal.sodium,
        }

    meal_data = [serialize_except(meal) for meal in recent_meals]
    return jsonify(meal_data)


@app.route("/deletemeal", methods=["DELETE"])
@jwt_required()
def delete_meal():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)
    data = request.get_json()
    tid = data.get("targetID")
    if not tid:
        return jsonify({"message": "invalid target"}), 400
    target_meal = Meal.get(id=tid, user=current_user.id)
    if target_meal is not None:
        target_meal.delete()
        return jsonify({"message": "Done"})
    return jsonify({"message": "failed"})


@app.route("/accountage", methods=["GET"])
@jwt_required()
def account_age():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)
    days_old = (date.today() - current_user.date_created.date()).days
    return jsonify({"days_old": days_old})


# To check which user is currently logged in via access token when user logs in
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == "__main__":
    app.run(debug=True)