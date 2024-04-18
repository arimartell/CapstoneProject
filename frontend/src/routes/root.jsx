//* Created by: Ariana Martell
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {
  useLocation,
  useOutlet,
  Outlet,
  Link,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import React from 'react';

// Good resource for messing with react router stuff
// https://reactrouter.com/en/main/start/tutorial
// Note a bunch of stuff here is unused, will prune things later, leaving in case needed
function LogoutButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Navigate to login
  };

  return (

      <button
        id="logout"
        onClick={handleLogout}
        className={isLoginPage ? 'hidden' : 'btn btn-primary absolute right-8 top-4'}
      >
        Logout
      </button>

  );
}
export default function Root() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <>
      {/* Navbar */}
      <div className="drawer z-[1]">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className="btn top-4 left-4 text-2xl absolute btn-primary material-symbols-outlined"
          >
            menu
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li>
              <Link to="/viewprofile">
                <span className="text-2xl shingo">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard">
                <span className="text-2xl shingo">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/graph">
                <span className="text-2xl shingo">Progress</span>
              </Link>
            </li>
            <li>
              <Link to="/lookup">
                <span className="text-2xl shingo">Lookup Food</span>
              </Link>
            </li>
            <li>
              <Link to="/recipe">
                <span className="text-2xl shingo">Recipe Lookup</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <LogoutButton />
      </div>
      <AnimatePresence mode="wait">
        {React.cloneElement(currentOutlet, { key: location.pathname })}
      </AnimatePresence>
    </>
  );
}
