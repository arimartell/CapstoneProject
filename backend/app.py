from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from pony.flask import Pony
from pony.orm import commit, Database, Required, Optional
from datetime import datetime
from models import db, User, Meal
# https://docs.ponyorm.org/integration_with_flask.html

# Flask app instance 
app = Flask(__name__)

# Config settings for Flask app
app.config.update(dict(
    DEBUG = True,
    SECRET_KEY = 'some secret blah blah',
    PONY = {
        'provider': 'sqlite',
        'filename': 'main.db3',
        'create_db': True,
    }
))


# Pony ORM binded with Flask app using config settings 
db.bind(**app.config['PONY'])

# Create map between entities and database tables, create tables if it doesn't exist 
db.generate_mapping(create_tables=True)

Pony(app)
# Define a route for the root URL
@app.route("/")
def home():
    return render_template('home.html')

@app.route("/login", methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.get(username=username)
        if user and check_password_hash(user.password, password):
            # Log the user in
            return "Logged in successfully"
        else:
            error = "Invalid username or password"
    return render_template('login.html', error=error)

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        existing_user = User.get(username=username)
        if existing_user:
            return "Username already exists"
        else:
            hashed_password = generate_password_hash(password)
            user = User(username=username, password=hashed_password)
            commit()
            return redirect(url_for('login'))
    return render_template('signup.html')

@app.route("/users") ### Testing if it creates an account and hashes password
def list_users():
    users = User.select()  # Fetch all users from the database
    return render_template('user_list.html', users=users)

# api = Api(app)

# class HelloWorld(Resource):
#     def get(self):
#         return { 'hello': 'world' }
    
# api.add_resource(HelloWorld, '/')

# Run the Flask application if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
