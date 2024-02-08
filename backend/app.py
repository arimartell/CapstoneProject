from flask import Flask
from pony.flask import Pony
from pony.orm import Database, Required, Optional
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
def hello_world():
    return "<h1>yooo</h1>"

# api = Api(app)

# class HelloWorld(Resource):
#     def get(self):
#         return { 'hello': 'world' }
    
# api.add_resource(HelloWorld, '/')

# Run the Flask application if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
