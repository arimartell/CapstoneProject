import { Link } from 'react-router-dom';
import SwipeAnimation from '../components/swipe';
import { useEffect } from 'react';
import { notify } from '../toast';
import { useNavigate } from 'react-router-dom';
//* Created by: Ariana Martell + Tabshir Ahmed
export default function Signup() {
  const navigate = useNavigate();

  async function signup(formData) {
    try {
      const signupAttempt = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const body = await signupAttempt.json();
      if (!signupAttempt.ok) {
        const { message } = body;
        notify(message, 'error');
        return;
      }

      const { access_token } = body;
      localStorage.setItem('token', access_token);
      notify('You Created An Account!', 'success');
      setTimeout(() => {
        navigate('/setprofile');
      }, 1500);
    } catch (e) {
      notify('Account Creation Failed', 'error');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      username: form.username.value,
      email: form.email.value,
      confirm_email: form.confirm_email.value,
      password: form.password.value,
      confirm_password: form.confirm_password.value,
    };
    await signup(formData);
  };

  return (
    <>
      <SwipeAnimation />
      <div className=" size-full min-h-screen flex justify-center items-center flex-col">
        <form
          id="signupform"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
          onSubmit={handleSubmit}
        >
          <h3 className="text-4xl font-bold shingo">Create an account</h3>
          {/* Username Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </label>

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

          {/* Confirm Email Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="email"
              name="confirm_email"
              placeholder="Confirm Email"
              required
            />
          </label>

          {/* Password Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </label>

          {/* Confirm Password Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              required
            />
          </label>

          <button id="signupbutton" className="btn btn-primary w-full max-w-sm">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}