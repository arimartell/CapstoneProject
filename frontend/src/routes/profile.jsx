//* Created by: Ariana Martell
import { useState } from 'react';

export default function Profile() {
  const [goalType, setGoalType] = useState('');

  const onGoalChange = (e) => {
    setGoalType(e.target.value);
  };

  return (
    <>
      <div className="size-full min-h-full flex flex-col justify-center items-center">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl shingo">Profile Page</div>
              <p class="py-4 ">
                Setup your profile & start tracking a goal by filling out
                details about yourself.
              </p>
            </div>
          </div>
        </div>

        <form
          action="/login"
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
              <span className="label-text w-16">Male </span>
            </label>
            <label className="label cursor-pointer">
              <input
                className="radio checked:bg-info"
                type="radio"
                name="sex"
                value="female"
              />
              <span className="label-text w-16">Female</span>
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
              <span className="label-text w-16">Weight Loss </span>
            </label>
            <label className="label cursor-pointer">
              <input
                className="radio checked:bg-info"
                type="radio"
                name="goaltype"
                value="maintenance"
                onClick={onGoalChange}
              />
              <span className="label-text w-16">Weight Maintenance</span>
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
