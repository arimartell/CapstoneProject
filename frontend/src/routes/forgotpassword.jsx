import { useEffect } from 'react';
import { notify } from '../toast';
import { useNavigate } from 'react-router-dom';
import SwipeAnimation from '../components/swipe';

export default function ForgotPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Forgot Password';

    const subBtn = document.getElementById('resetPasswordButton');
    const form = document.getElementById('forgotPasswordForm');

    form.onsubmit = (e) => {
      e.preventDefault();
    };

    async function forgotPassword() {
      try {
        const formData = new FormData(form);
        const email = formData.get('email');

        const response = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
          notify(data.message, 'error');
          return;
        }

        notify(data.message, 'success');
        navigate('/resetpassword');
      } catch (error) {
        notify('Failed to send reset token!', 'error');
      }
    }

    subBtn.onclick = async () => {
      await forgotPassword();
    };
  }, []);

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex justify-center items-center">
        <form
          id="forgotPasswordForm"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold shingo">Forgot Password</h3>

          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="email"
              name="email"
              placeholder="Email"
            />
          </label>

          <button id="resetPasswordButton" className="btn btn-primary w-full max-w-sm">
            Reset Password
          </button>

          <span className="italic text-info"></span>
        </form>
      </div>
    </>
  );
}