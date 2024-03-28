//* Created by: Ariana Martell
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useLocation, useOutlet, Outlet, Link } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import React from 'react';

// Good resource for messing with react router stuff
// https://reactrouter.com/en/main/start/tutorial
// Note a bunch of stuff here is unused, will prune things later, leaving in case needed

export default function Root() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  //   const { nodeRef } =
  //     routes.find((route) => route.path === location.pathname) ?? {};
  return (
    <>
      {/* Navbar */}
      <div className="drawer p-4 z-[1]">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
            Navigation
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
              {/*Link tag for client side render*/}
              <Link to="/login">
                <span className="text-2xl shingo">Login</span>
              </Link>
            </li>
            <li>
              <Link to="/signup">
                <span className="text-2xl shingo">Signup</span>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <span className="text-2xl shingo">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/meal">
                <span className="text-2xl shingo">Meal</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard">
                <span className="text-2xl shingo">Dashboard</span>
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {React.cloneElement(currentOutlet, { key: location.pathname })}
      </AnimatePresence>
    </>
  );
}
