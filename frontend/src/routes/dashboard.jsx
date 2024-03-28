import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuickCard from '../components/dashboardquicklinkscard';
import SwipeAnimation from '../components/swipe';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle mouse enter event
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  return (
    <>
      <SwipeAnimation />
      <div className="size-full flex flex-col justify-center items-center min-w-lg lg:px-24">
        {/* Adjusted container to display QuickCards in a row */}
        <div className=" min-w-lg text-4xl font-bold shingo quick-add-container flex flex-wrap justify-center items-center">
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
      </div>
    </>
  );
}
