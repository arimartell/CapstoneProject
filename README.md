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
- pytest test_app.py

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
- Developed the user authentication system, including features for login, sign-up, password recovery (forgot password), password reset, and email verification code functionality.
- Created the email_verif_code.py file to help assist with sending verification codes via email to ensure the integrity and authenticity of the user verification system.
- Designed and implemented HTML templates for home.html, login.html, signup.html, forgot_password.html, reset_password.html, verify_code.html.
- Implemented unit testing for user authentication. It encompasses various scenarious such as: test_valid_signup, test_invalid_signup_existing_email, test_invalid_signup_existing_username, test_invalid_signup_invalid_password, test_invalid_signup_not_matching_password, test_invalid_signup_not_matching_email, test_invalid_login, test_successful_login
- Implemented password encryption and hashing for user logins, ensuring secure storage of user credentials in the database. This process includes generating and storing a hash associated with each user for future login attempts.
- Implemented a signup feature to enforce unique usernames and email addresses, alongside stringent password requirements. These requirements include a minimum of eight characters, including at least one letter, one number, and one special character. Implemented various other edge cases for signups.
- Developed a forgot password feature enabling users to initiate a resetting their password. This process is fortified by the use of email authentication ensuring the password reset request is genuine.
- Implementing code for email verification and integrating it with the password reset process. Once a user initiates the password reset process by clicking on forgot password, they will be asked to type their email and if that email exists in the database, it is sent a verification code which they type on the verify code form. Afterwards they are forwarded to the password reset form where stringent password measures similar to signup are instilled.

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

Luca Burlacu:
- Implemented staple_meal and biometics pages inline with existing architecture 
- Staged changes to User class to incorportate attributes relating to biometrics 
- Created html templates for staple_meal and biometrics
- Implemented staple_meal and biometrics app routes in main file with calculations based on get and post requests
- Calculated BMR using the Harris–Benedict equation and scaling it by user activity level to achieve daily maintenece calories
- Set up tables for staple food types and created functionality to summize macro counts from each so user can form meals directly through the staple_meal page
- Set up testing modeles test_biometrics_page and test_staple_meal page to check connectivity based on authroization 
