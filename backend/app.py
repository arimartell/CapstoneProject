from flask import Flask, jsonify, request, session, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit
from models import db, User
import string
import re
from datetime import timedelta, datetime
from email_verif_code import *
from calculations import *

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

    # Generate a short-lived access token for resetting password
    access_token = create_access_token(identity=email, expires_delta=timedelta(minutes=15))

    # Return success message along with the access token for reset-password
    return jsonify({"message": "Verification code sent successfully", "access_token": access_token}), 200

@app.route("/reset-password", methods=["POST"])
@jwt_required()
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

    # Remove access token generated from forgot-password route
    response = jsonify({"message": "Password reset successful"})
    response.delete_cookie("access_token")
    
    return response, 200

@app.route("/profile", methods=["GET", "POST"])
@jwt_required()
def profile():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)

    if request.method == "POST":
        data = request.get_json()

        # Ensure all required fields are present in the request data
        required_fields = ["sex", "weight", "heightfeet", "heightinches", "birthday", "activitylevel", "diettype", "goaltype", "targetweight"]
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"Missing '{field}'"}), 400

        # Ensure none of the fields are empty
        for field, value in data.items():
            if value == "":
                return jsonify({"message": f"Invalid '{field}'"}), 400

        # Validate certain fields using regex
        if not re.match(r"^\d+$", data["weight"]):
            return jsonify({"message": "Invalid weight"}), 400
        if not re.match(r"^\d+$", data["heightfeet"]):
            return jsonify({"message": "Invalid height feet"}), 400
        if not re.match(r"^\d+$", data["heightinches"]):
            return jsonify({"message": "Invalid height inches"}), 400
        if data["goaltype"] == "loss" and not re.match(r"^\d+$", data["targetweight"]):
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
        current_user.maintenance_calories = 0
        current_user.diet_type = data["diettype"]

        commit()

        # Redirect to the home page after successfully updating profile
        return jsonify({"message": "Profile updated successfully"}), 200

    # Handle GET request to retrieve the user's profile
    return jsonify({
        "sex": current_user.sex,
        "weight": current_user.weight,
        "heightfeet": current_user.height // 12,
        "heightinches": current_user.height % 12,
        "birthday": current_user.birthday,
        "activitylevel": current_user.activity_level,
        "diettype": current_user.diet_type,
        "goaltype": current_user.goal_type,
        "targetweight": current_user.goal_weight
    }), 200

@app.route("/biometrics", methods=["GET"])
@jwt_required()
def biometrics():
    current_username = get_jwt_identity()
    current_user = User.get(username=current_username)

    # Grab user attributes to use in calculations
    weight = current_user.weight
    height = current_user.height
    activity_level = current_user.activity_level
    sex = current_user.sex
    goal_weight = current_user.goal_weight
    
    # Age calculation
    birthday = current_user.birthday
    today = datetime.today()
    age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))

    # Calculate BMR (Basal Metabolic Rate)
    bmr = int(calculate_bmr(weight, height, age, sex))

    # Calculate TDEE (Total Daily Energy Expenditure)
    tdee = int(calculate_tdee(bmr, activity_level))

    # Calculate weeks needed to reach weight goal
    weeks_to_goal = calculate_goal_weight_loss(weight, goal_weight)

    # Calculate average daily calories under the weight loss plan
    daily_calories = calculate_daily_calories(weight, height, age, sex, activity_level)

    # Calculate macronutrient ratios for each weight loss goal
    diet_type = current_user.diet_type
    carbs_calories_0_5lb, fats_calories_0_5lb, protein_calories_0_5lb = calculate_macronutrient_ratios(daily_calories[0], diet_type)
    carbs_calories_1lb, fats_calories_1lb, protein_calories_1lb = calculate_macronutrient_ratios(daily_calories[1], diet_type)
    carbs_calories_2lb, fats_calories_2lb, protein_calories_2lb = calculate_macronutrient_ratios(daily_calories[2], diet_type)

    # Calculate weights for each week based on weight loss rates
    current_weight = weight
    goal_weights_0_5lb = [current_weight - 0.5 * i for i in range(weeks_to_goal[0] + 1)]
    goal_weights_1lb = [current_weight - i for i in range(weeks_to_goal[1] + 1)]
    goal_weights_2lb = [current_weight - 2 * i for i in range(weeks_to_goal[2] + 1)]
    max_weeks = max(weeks_to_goal) + 1  
    x_labels = [f"Week {i}" for i in range(max_weeks)]

    # Update user's maintenance calories in the database
    current_user.maintenance_calories = tdee
    commit()

    # Prepare JSON response
    response = {
        "user": current_username,
        "bmr": bmr,
        "tdee": tdee,
        "age": age,
        "weeks_to_goal": weeks_to_goal,
        "daily_calories": daily_calories,
        "goal_weights_0_5lb": goal_weights_0_5lb,
        "goal_weights_1lb": goal_weights_1lb,
        "goal_weights_2lb": goal_weights_2lb,
        "x_labels": x_labels,
        "carbs_calories_0_5lb": carbs_calories_0_5lb,
        "fats_calories_0_5lb": fats_calories_0_5lb,
        "protein_calories_0_5lb": protein_calories_0_5lb,
        "carbs_calories_1lb": carbs_calories_1lb,
        "fats_calories_1lb": fats_calories_1lb,
        "protein_calories_1lb": protein_calories_1lb,
        "carbs_calories_2lb": carbs_calories_2lb,
        "fats_calories_2lb": fats_calories_2lb,
        "protein_calories_2lb": protein_calories_2lb
    }

    return jsonify(response)

# To check which user is currently logged in via access token when user logs in
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == "__main__":
    app.run(debug=True)
