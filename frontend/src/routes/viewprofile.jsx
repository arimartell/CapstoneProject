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
        const response = await axios.get('http://127.0.0.1:5000/profile', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching data
  }

  if (error || !profileData) {
    return <div>Error: {error || 'Profile data not available'}</div>; // Display error message if there's an error or profile data is not available
  }

  // Function to format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Chart.js configuration options
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Weight Loss Timeline',
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

  // Chart.js configuration options for donut chart
  const donutChartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Macronutrient Ratio (1 lb/week)',
        fontSize: 20,
        padding: 20
      }
    }
  };

  return (
    <>
      <SwipeAnimation />
      <div className="w-full min-h-screen flex flex-col justify-stretch items-center">
        <div className="hero bg-base-200 h-full min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl font-bold shingo">View Profile</div>
              <div className="mt-4">
                <Link to="/setprofile" className="btn btn-primary">
                  Change Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-md text-center mx-auto mt-8">
          <p className="text-xl mb-4"><strong>Sex:</strong> {profileData.sex}</p>
          <p className="text-xl mb-4"><strong>Birthday (MM/DD/YYYY):</strong> {formatDate(profileData.birthday)}</p>
          <p className="text-xl mb-4"><strong>Age:</strong> {profileData.age}</p>
          <p className="text-xl mb-4"><strong>Basal Metabolic Rate (BMR):</strong> {profileData.bmr}</p>  
          <p className="text-xl mb-4"><strong>Total Daily Energy Expenditure (TDEE):</strong> {profileData.tdee}</p>    
          <p className="text-xl mb-4"><strong>Diet Type:</strong> {profileData.diettype}</p>
          <p className="text-xl mb-4"><strong>Goal Type:</strong> {profileData.goaltype}</p>
          <p className="text-xl mb-4"><strong>Height:</strong> {profileData.heightfeet}' {profileData.heightinches}"</p>
          <p className="text-xl mb-4"><strong>Current Weight:</strong> {profileData.weight} lbs</p>
          {profileData.goaltype === 'loss' && (
            <p className="text-xl mb-4"><strong>Target Weight:</strong> {profileData.targetweight} lbs</p>
          )}
          {/* Chart.js Line chart for weight loss */}
          {profileData.goaltype !== 'maintenance' && (
            <div className="mt-8">
              <Line data={{
                labels: profileData.x_labels,
                datasets: [
                  {
                    label: '1 lb/week',
                    data: profileData.goal_weights_1lb,
                    borderColor: 'green',
                  },
                ]
              }} options={chartOptions} />
            </div>
          )}
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
            }} options={donutChartOptions} />
          </div>
        </div>
      </div>
    </>
  );
}
