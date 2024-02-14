import pytest
from app import app, db, User, Meal


# Fixture to create a test client and set up the database
@pytest.fixture
def client():
    # Set up Flask app configs https://flask.palletsprojects.com/en/3.0.x/testing/
    app.config["TESTING"] = True  # Flask app in testing mode
    app.config["WTF_CSRF_ENABLED"] = (
        False  # Disable Cross-Site Request Forgery to submit form without tokens default is usually true
    )

    # Create a test client for the Flask app
    with app.test_client() as client:
        # Create database tables
        db.create_tables()
    yield client  # Pass the client to the tests
    # Clean up database after tests
    #db.drop_all_tables(with_all_data=True) commented to prevent deleting user data 


# Test cases for the Flask app routes
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
