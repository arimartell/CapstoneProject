import { useState } from 'react';
import { notify } from '../toast';
import { useNavigate } from 'react-router-dom';
import SwipeAnimation from '../components/swipe';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    verification_code: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const { message } = await response.json();
        notify(message, 'error');
        return;
      }

      notify('Password reset successful!', 'success');
      navigate('/login');
    } catch (error) {
      notify('Failed to reset password!', 'error');
    }
  };

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold shingo">Reset Password</h3>

          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="verification_code"
              placeholder="Verification Code"
              value={formData.verification_code}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary w-full max-w-sm">Reset Password</button>
        </form>
      </div>
    </>
  );
}