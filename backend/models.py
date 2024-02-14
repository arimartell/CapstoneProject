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
    last_login = Optional(datetime)
    meals = Set('Meal')


class Meal(db.Entity):
    user = Required(User)
    name = Required(str)
    calories = Required(int, default=0)
    carbs = Required(int, default=0)
    total_fat = Required(int, default=0)
    sat_fat = Optional(int, default=0)
    trans_fat = Optional(int, default=0)
    carbs_fiber = Optional(int, default=0)
    carbs_sugar = Optional(int, default=0)
    protein = Required(int, default=0)
    sodium = Optional(int, default=0)
