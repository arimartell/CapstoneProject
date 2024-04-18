import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
          <p className="text-xl mb-4"><strong>Birthday:</strong> {formatDate(profileData.birthday)}</p>
          <p className="text-xl mb-4"><strong>Diet Type:</strong> {profileData.diettype}</p>
          <p className="text-xl mb-4"><strong>Goal Type:</strong> {profileData.goaltype}</p>
          <p className="text-xl mb-4"><strong>Height:</strong> {profileData.heightfeet}' {profileData.heightinches}"</p>
          <p className="text-xl mb-4"><strong>Current Weight:</strong> {profileData.weight} lbs</p>
          {profileData.goaltype === 'loss' && (
            <p className="text-xl mb-4"><strong>Target Weight:</strong> {profileData.targetweight} lbs</p>
          )}
        </div>
      </div>
    </>
  );
}
