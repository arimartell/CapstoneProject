import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuickCard from '../components/dashboardquicklinkscard';
import SwipeAnimation from '../components/swipe';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <>
      <SwipeAnimation />
      <div className="size-full flex flex-col items-center min-w-lg">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-xl">
              <div className="text-5xl font-bold shingo">
                Record what you've eaten today
              </div>
            </div>
          </div>
        </div>

        <section className="size-full flex flex-col justify-evenly items-center">
          <div className="max-w-xl text-white">
            <Chart type="doughnut" data={data} />
          </div>
          {/* Adjusted container to display QuickCards in a row */}
          <div className="w-full px-8 text-4xl font-bold shingo quick-add-container flex flex-col md:flex-row flex-wrap justify-center items-center">
            {/* QuickCards */}
            {/* Adjust margin as needed */}
            <QuickCard title={'Breakfast'} className="mb-20" />
            {/* Adjust margin as needed */}
            <QuickCard title={'Lunch'} />
            {/* Adjust margin as needed */}
            <QuickCard title={'Dinner'} />
            {/* Adjust margin as needed */}
            <QuickCard title={'Snacks'} />
          </div>
        </section>
      </div>
    </>
  );
}
