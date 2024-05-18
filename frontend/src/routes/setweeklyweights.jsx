import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwipeAnimation from '../components/swipe';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getToken } from '../main';

export default function SetWeeklyWeights() {
  const navigate = useNavigate();
  const [weeksToGoal, setWeeksToGoal] = useState(0);
  const [weeklyWeights, setWeeklyWeights] = useState([]);

  useEffect(() => {
    // Fetch existing weekly weights and weeks to goal
    async function fetchData() {
      try {
        const token = getToken();
        const response = await axios.get('http://127.0.0.1:5000/setweeklyweights', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const existingWeights = response.data.weekly_weights || [];
        const weeks = existingWeights.length;
        setWeeksToGoal(response.data.weeks_to_goal);
        const initializedWeights = [];
        for (let i = 0; i < weeks; i++) {
          initializedWeights.push(existingWeights[i] || '');
        }
        setWeeklyWeights(initializedWeights.concat(Array(response.data.weeks_to_goal - weeks).fill('')));
      } catch (error) {
        toast.error('Error fetching weekly weights.');
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const newWeights = weeklyWeights.map(Number).filter(weight => !isNaN(weight) && weight > 0);
      const response = await axios.post(
        'http://127.0.0.1:5000/setweeklyweights',
        { weekly_weights: newWeights },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      toast.success(response.data.message);
      navigate('/viewprofile');
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || 'An unexpected server error occurred.';
        toast.error(message);
      } else if (error.request) {
        toast.error('No response from server.');
      } else {
        toast.error('Error: ' + error.message);
      }
    }
  };

  const handleWeightChange = (index, value) => {
    const updatedWeights = [...weeklyWeights];
    updatedWeights[index] = value;
    setWeeklyWeights(updatedWeights);
  };

  return (
    <>
      <SwipeAnimation />
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-md w-full">
          <h1 className="text-5xl font-bold text-center mb-8">Set Weekly Weights</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {weeklyWeights.map((weight, index) => (
              <div key={index} className="form-control gap-2 w-full">
                <label className="label">
                  Week {index + 1} Weight
                </label>
                <input
                  className="input input-bordered w-full"
                  type="number"
                  min={0}
                  value={weight}
                  onChange={(e) => handleWeightChange(index, e.target.value)}
                  placeholder={`Week ${index + 1} Weight`}
                />
              </div>
            ))}
            <button className="btn btn-primary w-full">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
