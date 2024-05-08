from math import ceil
from models import db, User, Meal, Staple_meal, User_Weight
from datetime import timedelta, datetime
from pony.orm import db_session, select, desc




def calculate_bmr(weight, height, age, sex):
    '''
    Calculated using the Mifflin St. Jeor equation:
    For men: 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) + 5 (kcal / day)
    For women: 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) -161 (kcal / day)
    '''

    weight_kg = weight * 0.453592  # 1 pound is approximately 0.453592 kilograms
    height_cm = height * 2.54
    if sex.lower() == 'male':
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    elif sex.lower() == 'female':
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    return round(bmr, 2)

def calculate_tdee(bmr, activity_level):
    '''
    Calculated using the Mifflin St. Jeor equation:
    BMR * activity multipliers

    Note:
    Sedentary is little to no exercise
    Lightly active is exercise 1-2 days/week
    Moderate active is exercise 3-5 days/week
    Very active is hard exercise 6-7 days/week
    Extremely active is hard daily exercise, two times a day training
    '''

    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'heavy': 1.725,
        'extreme': 1.9
    }
    return round(bmr * activity_multipliers.get(activity_level.lower(), 1.2), 2)

def calculate_goal_weight_loss(current_weight, goal_weight):
    weight_loss_needed = current_weight - goal_weight
    weeks_to_goal = ceil(weight_loss_needed / 0.5), ceil(weight_loss_needed), ceil(weight_loss_needed / 2) # General assumption 1-2 lbs loss per week is ideal
    return weeks_to_goal # Weeks needed for losing 0.5lb, 1lb, 2lb per week

def calculate_daily_calories(weight, height, age, sex, activity_level):
    bmr = calculate_bmr(weight, height, age, sex)
    tdee = calculate_tdee(bmr, activity_level)
    daily_calories = int(tdee - 250),int(tdee - 500), int(tdee - 1000)
    return daily_calories
    
def calculate_macronutrient_ratios(daily_calories, diet_type):
    diet_ratios = {
        'regular': {'carbs': 0.4, 'fats': 0.3, 'protein': 0.3},
        'ketogenic': {'carbs': 0.1, 'fats': 0.7, 'protein': 0.2},
        'low_fat': {'carbs': 0.6, 'fats': 0.2, 'protein': 0.2},
        'low_carb': {'carbs': 0.2, 'fats': 0.55, 'protein': 0.25},
        'high_protein': {'carbs': 0.4, 'fats': 0.1, 'protein': 0.5}
    }
    
    diet = diet_ratios.get(diet_type.lower(), diet_ratios['regular'])
    
    # Calculate macronutrient ratios directly based on the provided daily calories
    carbs_calories = daily_calories * diet['carbs']
    fats_calories = daily_calories * diet['fats']
    protein_calories = daily_calories * diet['protein']
    
    return carbs_calories, fats_calories, protein_calories

def calculate_bmi(height, weight):
    '''
    Formula: BMI = (weight_lbs / (height_inches ** 2)) * 703

    Parameter:
        height: Height in inches.
        weight: Weight in pounds.

    Returns:
        float: BMI value rounded to two decimal places.
    '''
   
    bmi = (weight / (height ** 2)) * 703
    return round(bmi, 2)

def classify_bmi(bmi):
    '''
    BMI Categories:
    Underweight = <18.5
    Normal weight = 18.5 to 24.9
    Overweight = 25 to 29.9
    Obesity = BMI of 30 or greater
    '''

    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi < 25:
        return "Normal weight"
    elif 25 <= bmi < 30:
        return "Overweight"
    else:
        return "Obesity"
