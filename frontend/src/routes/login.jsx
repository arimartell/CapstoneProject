//* Created by: Ariana Martell
import { Link } from 'react-router-dom';
import { motion, useIsPresent } from 'framer-motion';
import SwipeAnimation from '../components/swipe';
import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    document.title = 'Login';
  }, []);
  
  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex justify-center items-center">
        <form
          action="/login"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold shingo">Login</h3>
          {/* Username Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="username"
              placeholder="Username"
            />
          </label>

          {/* Password Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="password"
              placeholder="Password"
            />
            {/* Forget Password link*/}
            <div className="label">
              <span className="label-text-alt italic text-info">
                <a className="link link-info text-sm" href="#">
                  <Link to="/resetpassword" className="link link-info text-sm">
                    Forgot Password?
                  </Link>
                </a>
              </span>
            </div>
          </label>

          <button className="btn btn-primary w-full max-w-sm">Login</button>
          {/* Create An Account link*/}
          <span className="italic text-info">
            <a className="link link-info text-sm" href="#">
              <Link to="/signup" className="link link-info text-sm">
                Create An Account
              </Link>
            </a>
          </span>
        </form>
      </div>
    </>
  );
}
