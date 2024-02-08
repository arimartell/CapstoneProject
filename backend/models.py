from pony.orm import Required, Optional, Database
from datetime import datetime
# Initalize Pony ORM Database instance 
db = Database()
# Defining entities https://docs.ponyorm.org/firststeps.html
class User(db.Entity):
    username = Required(str, unique=True)
    password = Required(str)
    last_login = Optional(datetime)

class Meal(db.Entity):
    name = Required(str)
    calories = Required(int, default=0)
    carbs = Required(int, default=0)
    total_fat = Required(int,default=0)
    sat_fat = Optional(int,default=0)
    trans_fat = Optional(int,default=0)
    carbs_fiber = Optional(int, default=0)
    carbs_sugar = Optional(int, default=0)
    protein = Required(int, default=0)
    sodium = Optional(int, default=0)