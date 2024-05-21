import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import QuickCard from '../components/dashboardquicklinkscard';
import SwipeAnimation from '../components/swipe';
import Badge from '../components/badge';
import star from '../assests/star.svg';
import thumb from '../assests/thumb.svg';
import note from '../assests/note.svg';
// badge svg source: https://www.svgrepo.com/collection/e-commerce-2/

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    cals_left: 0,
    protein_left: 0,
    total_cals: 0,
    total_protein: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [firstMealBadge, setFirstMealBadge] = useState(false);
  const [has3dayBadge, setHas3DayBadge] = useState(false);
  const [has7dayBadge, setHas7DayBadge] = useState(false);
  const [accountAge, setAccountAge] = useState(-1);
  const data = useLoaderData();

  // Ariana Martell Work in progress will mkae it show up for only first time meals
  const checkFirstMealBadge = async () => {
    try {
      const token = localStorage.getItem('token');
      // HTTP GET request to check for first meal badge
      const response = await fetch('/api/badge/firstmeal', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Parse JSON body of response
        const data = await response.json();
        // Extract 'has_badge'from the parsed data
        const { has_badge } = data;
        console.log(data)
        //Updates state of has_badge
        setFirstMealBadge(has_badge);
      }
    } catch (e) {
      throw e;
    }
  };

  const checkAccountAge = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/accountage', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Parse JSON body of response
        const data = await response.json();

        // ! To test the badges being given to the users, comment out the line below, and make a variable called "days_old" and change the number to see the corresponding badge show up.
        const { days_old } = data; // Age from database
        // const days_old = 7; // Manual age variable for testing



        if (days_old >= 3) setHas3DayBadge(true);
        if (days_old >= 7) setHas7DayBadge(true);

        console.log('Days old', days_old);
        setAccountAge(days_old);
      }
    } catch (e) {
      throw e;
    }
  };

  checkFirstMealBadge();
  checkAccountAge();

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

  useEffect(() => {
    // Function to create popup dialog with custom text
    const createPopup = (popuptext) => {
      const dialog = document.createElement('dialog');
      dialog.classList.add(
        'bg-base-200',
        'rounded-xl',
        'h-36',
        'p-8',
        'flex',
        'justify-center',
        'items-center',
        'flex-col',
      );
      const closebtn = document.createElement('button');
      closebtn.classList.add('btn', 'btn-primary', 'btn-sm');
      closebtn.innerText = 'Ok!';
      const p = document.createElement('p');
      p.classList.add('my-2');

      closebtn.setAttribute('autofocus', 'true');
      p.innerText = popuptext;
      // Append paragraph and button to dialog
      dialog.appendChild(p);
      dialog.appendChild(closebtn);

      return { dialog, closebtn, p };
    };
    // ? Check for ID of dialogs on page to avoid re-adding the dialogs, happens because of state updating means this check may happen more than once.
    const addedFirstMealDialog =
      document.querySelector('#firstmealpopup') !== null;
    const added7DayDialog = document.querySelector('#sevendaypopup') !== null;
    const added3DayDialog = document.querySelector('#threedaypopup') !== null;

    const token = localStorage.getItem('token');

    // Check if the firstMealBadge is true which indicates badge earned
    if (firstMealBadge && !addedFirstMealDialog) {
      // Check local storage to see if the badge popup has been shown before
      const shownPopup = localStorage.getItem(token + 'shownfirstmealbadge') ?? false;

      if (shownPopup !== 'true') {
        const { dialog, closebtn, p } = createPopup(
          'Your just earned a badge for creating your first meal!',
        );

        dialog.id = 'firstmealpopup';
        document.body.appendChild(dialog);
        // Behavior for close button
        closebtn.onclick = () => {
          dialog.close();
          dialog.remove();
          localStorage.setItem(token + 'shownfirstmealbadge', 'true');
        };

        dialog.showModal();
        // console.log('Has shown user?', shownPopup);
      }
    }

    if (accountAge !== -1) {
      const shouldShow7day =
        accountAge >= 7 && localStorage.getItem(token + 'shown7daybadge') !== 'true';

      const shouldShow3day =
        accountAge >= 3 &&
        accountAge <= 6 &&
        localStorage.getItem(token + 'shown3daybadge') !== 'true';

      if (shouldShow7day && !added7DayDialog) {
        // ? Show 7 day badge also skip 3day badge if neither have been shown since if you got the 7 day one, kinda obvious you'd get the 3 day one too, also showing both in sequence would be annoying
        const { dialog, closebtn, p } = createPopup(
          "Wow! 7 days really flew by didn't it?! Here's a badge for using our site for 7 days!",
        );
        dialog.id = 'sevendaypopup';

        document.body.appendChild(dialog);
        // Behavior for close button
        closebtn.onclick = () => {
          dialog.close();
          dialog.remove();
          localStorage.setItem(token + 'shown7daybadge', 'true');
          if (localStorage.getItem(token + 'shown3daybadge') !== 'true')
            localStorage.setItem(token + 'shown3daybadge', 'true');
        };
        dialog.showModal();
      }

      // ? The "!shouldShow7day" in the below if statement has small potential to cause some unintended behaviour, but it's an extra check anyway so it should never cause any issues
      if (!shouldShow7day && shouldShow3day && !added3DayDialog) {
        const { dialog, closebtn, p } = createPopup(
          "Congratulations on your 3-day anniversary with us 😄 here's to many more exciting days ahead!",
        );
        dialog.id = 'threedaypopup';
        document.body.appendChild(dialog);
        // Behavior for close button
        closebtn.onclick = () => {
          dialog.close();
          dialog.remove();
          localStorage.setItem(token + 'shown3daybadge', 'true');
        };
        dialog.showModal();
      }
    }
  }, [firstMealBadge, accountAge]);

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

        <div className="relative bg-base-200 rounded-xl m-2 p-4">
          <h3 className="text-2xl w-fit font-bold">
            Your Badges
            <hr />
          </h3>
          <div className="badge-container flex flex-row flex-wrap justify-center items-center">
            {firstMealBadge ? (
              <Badge img={star} title={'Star badge'} i={1} />
            ) : null}
            {has3dayBadge ? (
              <Badge img={thumb} title={'Thumbs up badge'} i={1.25} />
            ) : null}
            {has7dayBadge ? (
              <Badge img={note} title={'Notepad badge'} i={1.5} />
            ) : null}
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
