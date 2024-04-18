import { useState } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import QuickCard from '../components/dashboardquicklinkscard';
import SwipeAnimation from '../components/swipe';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    cals_left: 0,
    protein_left: 0,
    total_cals: 0,
    total_protein: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const data = useLoaderData();
  console.log(data);

  const fetchAndShowSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:5000/dashboard',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDashboardData(response.data);
      setShowSummary(true); // Show summary after fetching data
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setShowSummary(false); // Hide summary if there's an error
    }
  };

  return (
    <>
      <SwipeAnimation />
      <div className="size-full flex flex-col items-center min-w-lg">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-xl">
              <div className="text-5xl font-bold">
                Record what you've eaten today
              </div>
              <button
                className="mt-4 p-2 bg-blue-500 text-white rounded"
                onClick={fetchAndShowSummary}
              >
                {showSummary ? 'Refresh' : 'Show'} Nutrition Summary
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-8 font-bold quick-add-container flex flex-col md:flex-row flex-wrap justify-center items-center">
          <QuickCard title={'Breakfast'} recents={data} className="mb-20" />
          <QuickCard title={'Lunch'} recents={data} />
          <QuickCard title={'Dinner'} recents={data} />
          <QuickCard title={'Snacks'} recents={data} />
        </div>

        {showSummary && (
          <section className="size-full flex flex-col justify-evenly items-center">
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold mb-4">Nutrition Summary</h2>
              <p>Total Calories: {dashboardData.total_cals}</p>
              <p>Calories Left: {dashboardData.cals_left}</p>
              <p>Total Protein: {dashboardData.total_protein}g</p>
              <p>Protein Left: {dashboardData.protein_left}g</p>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
