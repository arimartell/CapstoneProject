import { useState } from 'react';
import axios from 'axios';
import SwipeAnimation from '../components/swipe';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

//* Created by: Tabshir Ahmed
export default function Profile() {
  const navigate = useNavigate();
  const [goalType, setGoalType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const formData = new FormData(e.target);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });

      const response = await axios.post(
        'http://127.0.0.1:5000/profile',
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data.message);
      // Navigate to dashboard upon successful submission
      toast.success('Profile saved successfully!');
      navigate('/dashboard');
      // Toastify popup with error message from backend validations 
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || "An unexpected server error occurred.";
        toast.error(message);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Error: " + error.message);
      }
    }
  };

  const onGoalChange = (e) => {
    setGoalType(e.target.value);
  };

  return (
    <>
      <SwipeAnimation />
      <div className="w-full min-h-screen flex flex-col justify-stretch items-center">
        <div className="hero bg-base-200 h-full min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl font-bold shingo">Profile Page</div>
              <p className="py-4 text-2xl">
                Setup your profile & start tracking a goal by filling out
                details about yourself.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col justify-start py-8 items-center h-full space-y-4 max-w-md"
        >
          {/* TODO: UNIT TYPE!!!, NEEDS INPUT */}
          <input type="hidden" name="unittype" value="imperial" readOnly />

          {/* Sex */}
          <div className="form-control gap-2 w-32">
            <label className="label cursor-pointer">
              <input
                className="radio checked:bg-info"
                type="radio"
                name="sex"
                value="male"
              />
              <span className="label-text w-16 text-base">Male </span>
            </label>
            <label className="label cursor-pointer">
              <input
                className="radio checked:bg-info"
                type="radio"
                name="sex"
                value="female"
              />
              <span className="label-text w-16 text-base">Female</span>
            </label>
          </div>

          {/* Weight */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              min={0}
              name="weight"
              placeholder="Weight"
            />
          </label>

          {/* Height */}
          <label className="gap-2 w-full join">
            <input
              className="input join-item input-bordered w-full"
              type="number"
              min={0}
              name="heightfeet"
              placeholder="Height (ft)"
            />
            <input
              className="input join-item input-bordered w-full"
              type="number"
              min={0}
              name="heightinches"
              placeholder="Height (in)"
            />
          </label>

          {/* Birthday */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="date"
              name="birthday"
              placeholder="Birthday"
            />
          </label>

          {/* Activity Level */}
          <label className="form-control gap-2 w-full">
            <select name="activitylevel" className="select select-bordered">
              <option disabled selected>
                Choose your activity level
              </option>
              <option value="sedentary">Sedentary (No excercise)</option>
              <option value="light">Some (Excercise 1-3 days per week)</option>
              <option value="moderate">
                Moderate (Excercise 3-5 days per week)
              </option>
              <option value="heavy">Heavy (Excercise 6-7 days per week)</option>
              <option value="extreme">Extreme (Excercise 2 times daily)</option>
            </select>
          </label>

          {/* Diet type */}
          <label className="form-control gap-2 w-full">
            <select name="diettype" className="select select-bordered">
              <option disabled selected>
                Choose your diet type
              </option>
              <option value="regular">
                Regular (40% Carbs, 30% Fats, 30% Protein)
              </option>
              <option value="ketogenic">
                Ketogenic (10% Carbs, 70% Fats, 20% Protein)
              </option>
              <option value="low_fat">
                Low Fat (60% Carbs, 20% Fats, 20% Protein)
              </option>
              <option value="low_carb">
                Low Carb (20% Carbs, 55% Fats, 25% Protein)
              </option>
              <option value="high_protein">
                High Protein (40% Carbs, 10% Fats, 50% Protein)
              </option>
            </select>
          </label>

          {/* Goal type */}
          <div className="form-control gap-2 w-32">
            <label className="label cursor-pointer">
              <input
                className="radio checked:bg-info"
                type="radio"
                name="goaltype"
                value="loss"
                onClick={onGoalChange}
              />
              <span className="label-text w-16 text-base">Weight Loss </span>
            </label>
            <label className="label cursor-pointer">
              <input
                className="radio checked:bg-info"
                type="radio"
                name="goaltype"
                value="maintenance"
                onClick={onGoalChange}
              />
              <span className="label-text w-16 text-base">
                Weight Maintenance
              </span>
            </label>
          </div>
          {/* Drop down another input for target weight if goal is weight loss */}
          {goalType === 'loss' ? (
            <>
              <label className="form-control gap-2 w-full">
                <input
                  className="input input-bordered w-full"
                  type="number"
                  min={0}
                  name="targetweight"
                  placeholder="Target Weight (lbs)"
                />
              </label>
            </>
          ) : null}
          {/* Weight (if goal is weightloss) */}

          <button className="btn btn-primary w-full max-w-sm">Submit</button>
        </form>
      </div>
    </>
  );
}
