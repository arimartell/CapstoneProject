//* Created by: Ariana Martell
import SwipeAnimation from '../components/swipe';
import { useEffect } from 'react';

export default function ForgotPassword() {
  useEffect(() => {
    document.title = 'Forgot Password';
  }, []);
  return (
    <>
      <SwipeAnimation />
      <div className=" size-full min-h-screen flex justify-center items-center flex-col">
        <form
          action="/forgotpassword"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold shingo">Enter Email</h3>

          {/* Email Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </label>

          <button className="btn btn-primary w-full max-w-sm">
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
}
