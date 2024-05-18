from pony.orm import Required, Optional, Database, PrimaryKey, Set
from datetime import datetime
from flask_login import UserMixin

# Initalize Pony ORM Database instance
db = Database()


# Defining entities https://docs.ponyorm.org/firststeps.html
class User(db.Entity, UserMixin):
    id = PrimaryKey(int, auto=True)
    username = Required(str, unique=True)
    password = Required(str)
    email = Required(str, unique=True)
    last_login = Optional(datetime)
    meals = Set("Meal")
    unit_type = Optional(str, default="imperial")
    sex = Optional(str, default="")
    weight = Optional(int, default=0)  # lbs
    height = Optional(int, default=0)  # inches
    birthday = Optional(datetime)
    age = Optional(int, default=0)
    activity_level = Optional(str, default="")
    goal_type = Optional(str, default="")  # weight loss or weight maintenance
    goal_weight = Optional(int, default=0)
    protein_goal = Optional(float, default=0.0)
    diet_type = Optional(str, default="")
    bmr = Optional(float, default=0)
    tdee = Optional(float, default=0)
    date_created = Required(datetime, default=datetime.now)
    weeks_to_goal = Optional(int, default=0)
    weekly_weight = Optional(str, default="[]")
    


class Meal(db.Entity):
    user = Required(User)
    name = Required(str)
    date = Required(datetime)
    calories = Required(float, default=0)
    carbs = Required(float, default=0)
    total_fat = Required(float, default=0)
    sat_fat = Optional(float, default=0)
    trans_fat = Optional(float, default=0)
    carbs_fiber = Optional(float, default=0)
    carbs_sugar = Optional(float, default=0)
    protein = Required(float, default=0)
    sodium = Optional(float, default=0)
    


class Staple_meal(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    calories = Required(float, default=0)
    carbs = Required(float, default=0)
    total_fat = Required(float, default=0)
    sat_fat = Optional(float, default=0)
    trans_fat = Optional(float, default=0)
    carbs_fiber = Optional(float, default=0)
    carbs_sugar = Optional(float, default=0)
    protein = Required(float, default=0)
    sodium = Optional(float, default=0)
    serving_size = Required(int, default=0)


class User_Weight(db.Entity):
    id = PrimaryKey(int, auto=True)
    user_id = Required(int)
    weight = Required(int)
    date = Required(datetime)
