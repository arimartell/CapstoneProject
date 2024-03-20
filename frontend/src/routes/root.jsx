//* Created by: Ariana Martell
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useLocation, useOutlet, Outlet, Link } from 'react-router-dom';

// Good resource for messing with react router stuff
// https://reactrouter.com/en/main/start/tutorial
// Note a bunch of stuff here is unused, will prune things later, leaving in case needed

export default function Root() {
  //   const location = useLocation();
  //   const currentOutlet = useOutlet();
  //   const { nodeRef } =
  //     routes.find((route) => route.path === location.pathname) ?? {};
  return (
    <>
      {/* Navbar */}
      <div class="drawer absolute p-4">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <label for="my-drawer" class="btn btn-primary drawer-button">
            Navigation
          </label>
        </div>
        <div class="drawer-side">
          <label
            for="my-drawer"
            aria-label="close sidebar"
            class="drawer-overlay z"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
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
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
}
