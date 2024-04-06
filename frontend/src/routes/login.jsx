//* Created by: Ariana Martell
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
        // Try logging in via backend with form
        const loginAttempt = await fetch('/api/login', {
          method: 'post',
          body: new FormData(form),
        });

        const ok = loginAttempt.ok;
        const body = await loginAttempt.json();
        if (!ok) {
          const { message } = body;
          notify(message, 'erorr');
          return;
        }

        if (loginAttempt.ok) {
          const { access_token } = body;
          localStorage.setItem('token', access_token);
          notify('Login Success!', 'success');
          setTimeout(() => {
            navigate('/profile');
          }, 1500);
        }
      } catch (e) {
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
