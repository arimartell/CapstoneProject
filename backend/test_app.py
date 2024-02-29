from flask import url_for
import pytest
from app import app, db, User, Meal
from pony.orm import db_session


# Fixture to create a test client and set up the database
@pytest.fixture
def client():
    # Set up Flask app configs https://flask.palletsprojects.com/en/3.0.x/testing/
    app.config["TESTING"] = True  # Flask app in testing mode
    app.config["WTF_CSRF_ENABLED"] = (
        False  # Disable Cross-Site Request Forgery to submit form without tokens default is usually true
    )

    # Create a test client
    with app.test_client() as client:
        # Create database tables
        db.create_tables()
    yield client  # Pass the client to the tests
    # Clean up database after tests
    # db.drop_all_tables(with_all_data=True) commented to prevent deleting user data


# ? Test cases routes
def test_home_page(client):
    # Test if the home page returns a status code of 200
    response = client.get("/")
    assert response.status_code == 200


def test_login_page(client):
    # Test if the login page returns a status code of 200
    response = client.get("/login")
    assert response.status_code == 200


def test_signup_page(client):
    # Test if the signup page returns a status code of 200
    response = client.get("/signup")
    assert response.status_code == 200

def test_staple_meal_page(client):
    # Test if the staple_meal page returns a status code of 200
    response = client.get("/staple_meal")
    assert response.status_code == 200

def test_biometrics_page(client):
    # Test if the biometrics page returns a status code of 401 
    response = client.get("/biometrics")
    assert response.status_code == 200



def test_valid_signup(client):
    # Test if signup is successful
    data = {
        "username": "test_user",
        "email": "test@example.com",
        "confirm_email": "test@example.com",
        "password": "$$Test1$$",
        "confirm_password": "$$Test1$$"
    }
    response = client.post("/signup", data=data, follow_redirects=True)
    assert response.status_code == 200
    assert b"login" in response.data

    with db_session:
        user = User.get(username="test_user")
        if user:
            user.delete()

def test_invalid_signup_existing_email(client):
    with db_session:
        existing_user = User(username="test_user", email="test@example.com", password="existing_password")
        existing_user.flush()  # Flush the user to commit it to the database

    data = {
        "username": "test2_user",
        "email": "test@example.com",
        "confirm_email": "test@example.com",
        "password": "$$Test1$$",
        "confirm_password": "$$Test1$$"
    }
    response = client.post("/signup", data=data, follow_redirects=True)

    # Assert that the signup fails due to the existing email
    assert b"Email already exists" in response.data

    with db_session:
        user = User.get(username="test_user")
        if user:
            user.delete()

def test_invalid_signup_existing_username(client):
    # Test signup fail due to existing username in database
    with db_session:
        existing_user = User(username="test_user", email="test@example.com", password="existing_password")
        existing_user.flush()

    data = {
        "username": "test_user",
        "email": "test2@example.com",
        "confirm_email": "test2@example.com",
        "password": "$$Test1$$",
        "confirm_password": "$$Test1$$"
    }
    response = client.post("/signup", data=data, follow_redirects=True)

    # Assert that the signup fails due to the existing username
    assert b"Username already exists" in response.data

    with db_session:
        user = User.get(username="test_user")
        if user:
            user.delete()

def test_invalid_signup_invalid_password(client):
    data = {
        "username": "test_user",
        "email": "test@example.com",
        "confirm_email": "test@example.com",
        "password": "Test",
        "confirm_password": "Test"
    }
    response = client.post("/signup", data=data, follow_redirects=True)

    # Assert that the signup fails due to invalid password
    assert b"Password must be at least 8 characters long and contain at least one alphabet letter, one number, and one special character" in response.data

def test_invalid_signup_not_matching_password(client):
    data = {
        "username": "test_user",
        "email": "test@example.com",
        "confirm_email": "test@example.com",
        "password": "Test1$$$$",
        "confirm_password": "Test2$$$$"
    }
    response = client.post("/signup", data=data, follow_redirects=True)

    # Assert that the signup fails due to Passwords not matching
    assert b"Passwords do not match" in response.data

def test_invalid_signup_not_matching_email(client):
    data = {
        "username": "test_user",
        "email": "test@example.com",
        "confirm_email": "test1@example.com",
        "password": "Test1$$$$",
        "confirm_password": "Test1$$$$"
    }
    response = client.post("/signup", data=data, follow_redirects=True)

    # Assert that the signup fails due to Emails not matching
    assert b"Emails do not match" in response.data

def test_invalid_login(client):
    # Test invalid login credentials
    data = {"login_identifier": "wrong_user", "password": "wrong_password"}
    response = client.post("/login", data=data, follow_redirects=True)
    assert b"Invalid username or password" in response.data

def test_successful_login(client):
    # Test sucessful login of existing user
    data = {
        "login_identifier": "Tabshir",
        "password": "Test1$$$$"
    }
    response = client.post("/login", data=data, follow_redirects=True)

    assert response.status_code == 200
    assert response.request.path == "/"

def test_meal_page(client):
    # Test if the meal page returns a status code of 401 for unauthorized access
    response = client.get("/meal")
    assert response.status_code == 401


def test_profile_page(client):
    # Test if the profile page returns a status code of 401 for unauthorized access
    response = client.get("/profile")
    assert response.status_code == 401


def test_forgot_password_page(client):
    # Test if the forget password page returns a status code of 200
    response = client.get("/forgot-password")
    assert response.status_code == 200


def test_reset_password_page(client):
    # Test if the reset password page returns a status code of 200
    response = client.get("/reset-password")
    assert response.status_code == 200


def test_staple_meal_page(client):
    # Test if the staple meal page returns a status code of 401 for unauthorized access
    response = client.get("/staple_meal")
    assert response.status_code == 401


def test_verify_code_page(client):
    # Test if the staple meal page returns a status code of 200
    response = client.get("/verify-code")
    assert response.status_code == 200


# Retrieves valid user in the database to use for test cases
def login(client):
    return client.post(
        "/login", data={"login_identifier": "bob2", "password": "abc123!!!"}
    )


# ? Test missing fields on profile route
def test_profile_missing_data(client):
    login(client)
    # Test missing unittype field
    data_missing_unittype = {
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }

    response = client.post("/profile", data=data_missing_unittype)
    assert response.status_code == 400, response.text

    # Test missing sex field
    data_missing_sex = {
        "unittype": "metric",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_sex)
    assert response.status_code == 400, response.text

    # Test missing weight
    data_missing_weight = {
        "unittype": "metric",
        "sex": "male",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_weight)
    assert response.status_code == 400, response.text
    # Test missing heightfeet
    data_missing_heightfeet = {
        "unittype": "metric",
        "sex": "male",
        "weight": "103",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_heightfeet)
    assert response.status_code == 400, response.text
    # Test missing heightinches
    data_missing_heightinches = {
        "unittype": "metric",
        "sex": "male",
        "weight": "103",
        "heightfeet": "5",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_heightinches)
    assert response.status_code == 400, response.text
    # Test missing birthday
    data_missing_birthday = {
        "unittype": "metric",
        "sex": "male",
        "weight": "103",
        "heightfeet": "5",
        "heightinches": "9",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_birthday)
    assert response.status_code == 400, response.text
    # Test missing activitylevel
    data_missing_activitylevel = {
        "unittype": "metric",
        "sex": "male",
        "weight": "103",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_activitylevel)
    assert response.status_code == 400, response.text
    # Test missing goaltype
    data_missing_goaltype = {
        "unittype": "metric",
        "sex": "male",
        "weight": "103",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_missing_goaltype)
    assert response.status_code == 400, response.text
    # Test missing targetweight
    data_missing_targetweight = {
        "unittype": "metric",
        "sex": "male",
        "weight": "103",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
    }
    response = client.post("/profile", data=data_missing_targetweight)
    assert response.status_code == 400, response.text


# ? Tests empty data in the fields
def test_profile_empty_data(client):

    login(client)

    # Test for empty unittype
    data_empty_unittype = {
        "unittype": "",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_unittype)
    assert response.status_code == 400, response.text

    # Test for empty sex
    data_empty_sex = {
        "unittype": "metric",
        "sex": "",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_sex)
    assert response.status_code == 400, response.text

    # Test for empty weight
    data_empty_weight = {
        "unittype": "metric",
        "sex": "male",
        "weight": "",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_weight)
    assert response.status_code == 400, response.text

    # Test for empty height field
    data_empty_heightfeet = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_heightfeet)
    assert response.status_code == 400, response.text

    # Test for empty heightinches
    data_empty_heightinches = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_heightinches)
    assert response.status_code == 400, response.text

    # Test for empty birthday
    data_empty_birthday = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_birthday)
    assert response.status_code == 400, response.text

    # Test for empty activitylevel
    data_empty_activitylevel = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_activitylevel)
    assert response.status_code == 400, response.text

    # Test for empty goaltype
    data_empty_activitylevel = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_empty_activitylevel)
    assert response.status_code == 400, response.text

    # Test for empty targetweight
    data_empty_targetweight = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "",
    }
    response = client.post("/profile", data=data_empty_targetweight)
    assert response.status_code == 400, response.text


# ? Test for invalid weight, heightfeet, heightinches, targetweight that contain nondigits
def test_profile_invalid_data(client):
    login(client)
    # Test for nondigit weight
    data_invalid_weight = {
        "unittype": "metric",
        "sex": "male",
        "weight": "abc",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_invalid_weight)
    assert response.status_code == 400, response.text
    # Test for nondigit heightfeet
    data_invalid_heightfeet = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "abc",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_invalid_heightfeet)
    assert response.status_code == 400, response.text
    # Test for nondigit heightinches
    data_invalid_heightinches = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "abc",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_invalid_heightinches)
    assert response.status_code == 400, response.text
    # Test for nondigit targetweight
    data_invalid_targetweight = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "abc",
    }
    response = client.post("/profile", data=data_invalid_targetweight)
    assert response.status_code == 400, response.text


# ? Tests for valid user inputs
#! Some unit tests not passing will fix soon
def test_profile_valid_data(client):

    login(client)

    data_valid_inputs = {
        "unittype": "metric",
        "sex": "male",
        "weight": "70",
        "heightfeet": "5",
        "heightinches": "9",
        "birthday": "1990-01-01",
        "activitylevel": "active",
        "goaltype": "lose",
        "targetweight": "65",
    }
    response = client.post("/profile", data=data_valid_inputs, follow_redirects=True)
    assert response.status_code != 400


# ? Test missing fields on Meal page
def test_meal_missing_data(client):
    login(client)
    # Test missing name
    data_missing_name = {
        "calories": "70",
        "carbs": "5",
        "total_fat": "9",
        "protein": "6",
    }

    response = client.post("/profile", data=data_missing_name)
    assert response.status_code == 400, response.text

    # Test missing calories
    data_missing_calories = {
        "name": "Burger",
        "carbs": "5",
        "total_fat": "9",
        "protein": "6",
    }

    response = client.post("/profile", data=data_missing_calories)
    assert response.status_code == 400, response.text

    # Test missing carbs
    data_missing_carbs = {
        "name": "Burger",
        "calories": "70",
        "total_fat": "9",
        "protein": "6",
    }

    response = client.post("/profile", data=data_missing_carbs)
    assert response.status_code == 400, response.text

    data_missing_total_fat = {
        "name": "Burger",
        "calories": "70",
        "carbs": "5",
        "protein": "6",
    }

    response = client.post("/profile", data=data_missing_total_fat)
    assert response.status_code == 400, response.text

    data_missing_protein = {
        "name": "Burger",
        "calories": "70",
        "carbs": "5",
        "total_fat": "9",
    }

    response = client.post("/profile", data=data_missing_protein)
    assert response.status_code == 400, response.text


# ? Tests empty fields for Meal page


def test_meal_empty_data(client):

    login(client)

    # Test for empty name
    data_empty_name = {
        "name": "",
        "calories": "70",
        "carbs": "5",
        "total_fat": "9",
        "protein": "6",
    }
    response = client.post("/meal", data=data_empty_name)
    assert response.status_code == 400, response.text

    # Test for empty calories
    data_empty_calories = {
        "name": "Burger",
        "calories": "",
        "carbs": "5",
        "total_fat": "9",
        "protein": "6",
    }
    response = client.post("/meal", data=data_empty_calories)
    assert response.status_code == 400, response.text
    # Test for empty carbs
    data_empty_carbs = {
        "name": "Burger",
        "calories": "70",
        "carbs": "",
        "total_fat": "9",
        "protein": "6",
    }
    response = client.post("/meal", data=data_empty_carbs)
    assert response.status_code == 400, response.text
    # Test for empty fat
    # data_empty_total_fat = {
    #     "name": "Burger",
    #     "calories": "70",
    #     "carbs": "5",
    #     "total_fat": "",
    #     "protein": "6",
    # }
    # response = client.post("/meal", data=data_empty_total_fat)
    # assert response.status_code == 400, response.text
    # Test for empty protein
    data_empty_total_protein = {
        "name": "Burger",
        "calories": "70",
        "carbs": "5",
        "total_fat": "9",
        "protein": "",
    }
    response = client.post("/meal", data=data_empty_total_protein)
    assert response.status_code == 400, response.text

