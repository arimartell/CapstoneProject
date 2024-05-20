import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import SwipeAnimation from '../components/swipe';
import { getToken } from '../main';

export default function ViewProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get('http://127.0.0.1:5000/profile', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const weeklyWeightsResponse = await axios.get('http://127.0.0.1:5000/setweeklyweights', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const profileDataWithWeeklyWeights = {
          ...profileResponse.data,
          weekly_weights: weeklyWeightsResponse.data.weekly_weights,
        };

        setProfileData(profileDataWithWeeklyWeights);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const formatRate = (rate) => {
    return rate ? `${rate >= 0 ? '+' : ''}${rate} lbs` : 'Data not available';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const calculateProjectedWeights = (startWeight, rate, numWeeks) => {
    let weights = [];
    for (let i = 0; i <= numWeeks; i++) {
      weights.push(startWeight + rate * i);
    }
    return weights;
  };

  const chartData = profileData ? {
    labels: profileData.x_labels,
    datasets: [
      {
        label: 'Actual Weight',
        data: profileData.weekly_weights,
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Projected Weight (1 Week Rate)',
        data: calculateProjectedWeights(profileData.weekly_weights[0], profileData.weight_in_rate_one_week, profileData.x_labels.length),
        borderColor: 'red',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Projected Weight (1 Month Rate)',
        data: calculateProjectedWeights(profileData.weekly_weights[0], profileData.weight_in_rate_one_month / 4, profileData.x_labels.length),
        borderColor: 'green',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Projected Weight (3 Months Rate)',
        data: calculateProjectedWeights(profileData.weekly_weights[0], profileData.weight_in_rate_three_months / 12, profileData.x_labels.length),
        borderColor: 'purple',
        borderDash: [5, 5],
        fill: false,
      }
    ]
  } : {};

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Weight Timeline',
        fontSize: 20,
        padding: 20
      }
    },
    scales: {
      y: {
        scaleLabel: {
          display: true,
          labelString: 'Weight (lbs)'
        }
      },
      x: {
        scaleLabel: {
          display: true,
          labelString: 'Weeks'
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !profileData) {
    return <div>Error: {error || 'Profile data not available'}</div>;
  }

  return (
    <>
      <SwipeAnimation />
      <div className="w-full min-h-screen flex flex-col justify-stretch items-center">
        <div className="hero bg-base-200 h-full min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl font-bold">View Profile</div>
              <div className="mt-4">
                {profileData.goaltype !== 'maintenance' && (
                  <Link to="/setweeklyweights" className="btn btn-primary">
                    Update Weekly Weights
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-md text-center mx-auto mt-8">
          {/* Display profile data */}
          <p className="text-xl mb-4"><strong>Sex:</strong> {profileData.sex}</p>
          <p className="text-xl mb-4"><strong>Birthday (MM/DD/YYYY):</strong> {formatDate(profileData.birthday)}</p>
          <p className="text-xl mb-4"><strong>Age:</strong> {profileData.age}</p>
          <p className="text-xl mb-4"><strong>Height:</strong> {profileData.heightfeet}' {profileData.heightinches}"</p>
          <p className="text-xl mb-4"><strong>Current Weight:</strong> {profileData.weight} lbs</p>
          {profileData.goaltype !== 'maintenance' && (
            <p className="text-xl mb-4"><strong>Target Weight:</strong> {profileData.targetweight} lbs</p>
          )}
          <p className="text-xl mb-4"><strong>Goal Type:</strong> {profileData.goaltype}</p>
          <p className="text-xl mb-4"><strong>Basal Metabolic Rate:</strong> {profileData.bmr} calories</p>
          <p className="text-xl mb-4"><strong>Total Daily Energy Expenditure:</strong> {profileData.tdee} calories</p>
          <p className="text-xl mb-4"><strong>Suggested Daily Calorie Intake:</strong> {profileData.suggested_daily_calorie_intake} calories</p>
          <p className="text-xl mb-4"><strong>Diet Type:</strong> {profileData.diettype} (Carbs: {profileData.carbs_percentage}%, Fats: {profileData.fats_percentage}%, Proteins: {profileData.proteins_percentage}%)</p>
          {/* Chart.js Line chart for weight loss or gain*/}
          <div className="mt-8" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="graph-container">
              <Line 
                data={chartData}
                options={chartOptions} 
                height={600} // Adjust the height of the Line Chart
                width={800} // Adjust the width of the Line Chart
              />
            </div>
          </div>
          {/* Chart.js Donut chart for macronutrient ratio */}
          <div className="mt-8">
            <Doughnut data={{
              labels: ['Carbs', 'Fats', 'Protein'],
              datasets: [{
                label: 'Calories',
                data: [profileData.carbs_calories_1lb, profileData.fats_calories_1lb, profileData.protein_calories_1lb],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
              }]
            }} options={{
              plugins: {
                title: {
                  display: true,
                  text: 'Macronutrient Ratio (1 lb/week)',
                  fontSize: 20,
                  padding: 20
                }
              }
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
