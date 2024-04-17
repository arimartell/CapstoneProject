//* Created by: Ariana Martell + Tabshir Ahmed
import { Link } from 'react-router-dom';
import SwipeAnimation from '../components/swipe';
import { useEffect } from 'react';
import { notify } from '../toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login';

    // Grab needed elements
    const subBtn = document.getElementById('loginbutton');
    const form = document.getElementById('loginform');

    // Prevents default browser behaviour of reloading the page whenever you submit a form
    form.onsubmit = (e) => {
      e.preventDefault();
    };

    async function login() {
      try {
        const formData = new FormData(form);
        const loginData = {
          login_identifier: formData.get('login_identifier'),
          password: formData.get('password'),
        };

        const loginAttempt = await fetch('/api/login', {
          method: 'post',
          headers: {
            // Important for server to identify JSON data
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        if (!loginAttempt.ok) {
          const { message } = await loginAttempt.json();
          notify(message, 'error');
          return;
        }

        const response = await loginAttempt.json();
        const { access_token, isFirstLogin } = response;
        localStorage.setItem('token', access_token);
        notify('Login Success!', 'success');
        // Navigate to profile if first time user otherwise goes to dashboard
        if (isFirstLogin) {
          navigate('/profile');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        notify('Login failed!', 'error');
      }
    }

    subBtn.onclick = async () => {
      await login();
    };
  }, []);

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex justify-center items-center">
        <form
          id="loginform"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold shingo">Login</h3>
          {/* Login Identifier Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="login_identifier" // I tweaked the two lines to indicate login by Username or Email instead of just Username
              placeholder="Username or Email"
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
                  <Link to="/forgotpassword" className="link link-info text-sm">
                    Forgot Password?
                  </Link>
                </a>
              </span>
            </div>
          </label>

          <button id="loginbutton" className="btn btn-primary w-full max-w-sm">
            Login
          </button>
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
