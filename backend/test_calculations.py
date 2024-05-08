from calculations import *

def test_calculate_bmr():
    # Test for male 177lbs, 68 inches (5 foot 8), 25 years old
    assert int(calculate_bmr(177, 68, 25, 'male')) == 1762
    print("test_calculate_bmr passed")

def test_calculate_tdee():
    # Test for BMR 1773.75 with different activity levels
    assert int(calculate_tdee(1762, 'sedentary')) == 2114  # BMR * 1.2
    print("test_calculate_tdee passed")

def test_calculate_goal_weight_loss():
    # Test for current weight 177, goal weight 160
    assert calculate_goal_weight_loss(177, 160) == (34, 17, 9)
    print("test_calculate_goal_weight_loss passed")

def test_calculate_daily_calories():
    assert calculate_daily_calories(177, 68, 25, 'male', 'sedentary') == (1864, 1614, 1114)
    print("test_calculate_daily_calories passed")

def test_calculate_macronutrient_ratios():
    assert calculate_macronutrient_ratios(2160, 'regular') == (864.0, 648.0, 648.0)
    print("test_calculate_macronutrient_ratios passed")

def test_bmi():
    assert calculate_bmi(65, 145) == 24.13
    print("test_bmi pased")



if __name__ == "__main__":
    test_calculate_bmr()
    test_calculate_tdee()
    test_calculate_goal_weight_loss()
    test_calculate_daily_calories()
    test_calculate_macronutrient_ratios()
    test_bmi() 
