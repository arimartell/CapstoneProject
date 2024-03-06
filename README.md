app.py resources 
- https://docs.ponyorm.org/integration_with_flask.html
- https://docs.ponyorm.org/firststeps.html
- https://flask-restful.readthedocs.io/en/latest/quickstart.html
- https://flask.palletsprojects.com/en/3.0.x/quickstart/
- https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/
- https://www.youtube.com/watch?v=71EU8gnZqZQ  (A helpful guide on using Flask for User Auth Login)
- https://mailtrap.io/blog/python-send-email-gmail/ (A guide for using python to send emails)
- https://docs.ponyorm.org/transactions.html (Testing database with using db_session from Pony ORM)

Modules to install:

- pip install flask
- flask-login
- pony
- pytest

NOTE: we only implemented code in backend folder, ignore frontend folder

Run app: 

- cd backend
- python3 app.py

Run test cases command:
- cd backend
- pytest 

Note that we have to make sure that users used for unit tests are in the database

Database terminal commands https://www.sqlitetutorial.net/sqlite-select/:
cd backend
sqlite3 ./main.db3
SELECT * FROM user;
SELECT * FROM meal;
.tables
.schema

# Who Worked on What?
Tabshir Ahmed:
- Created the login, signup, forgot password, reset password, and verify code features.
- Created the email_verif_code.py file to assist with sending emails for verification.
- Created HTML templates for home.html, login.html, signup.html, forgot_password.html, reset_password.html, verify_code.html.
- Started implementing unit testing for user login/auth. Created test_valid_signup, test_invalid_signup_existing_email, test_invalid_signup_existing_username, test_invalid_signup_invalid_password, test_invalid_signup_not_matching_password, test_invalid_signup_not_matching_email, test_invalid_login, test_successful_login

Ariana Martell:
- Set up Flask app and integrated with PONY ORM
- Made class Meal and User in models.py
- Created home, profile, meal page routes
- Created HTML templates for home, meal, profile pages
- Implemented automatic redirection for first-time users upon completing account creation, guiding them directly to the profile page for further setup
- Implemented control measures to restrict unauthorized user access to pages
- Implemented a guard to make sure users aren't inputting data to meal page when they haven't filled out the profile page, it will throw "Profile Not filled!" error
- Implemented regular expression-based validation to prevent the passage of invalid data
- Created test_app.py file and made unit tests for profile and meal pages: test_profile_missing_data, test_profile_empty_data, test_profile_invalid_data, test_profile_valid_data, test_meal_missing_data, test_meal_empty_data, test_meal_nondigit_data, test_meal_valid_data
