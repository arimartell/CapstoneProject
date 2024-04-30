import { useEffect } from 'react';
import SwipeAnimation from '../components/swipe';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/badge';

//* Created by: Ariana Martell
export default function Meal() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Meal';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/meal',
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data.message);
      toast.success('Meal saved successfully!');
      navigate('/meal');
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data.message || 'An unexpected server error occurred.';
        toast.error(message);
      } else if (error.request) {
        toast.error('No response from server.');
      } else {
        toast.error('Error: ' + error.message);
      }
    }
  };
  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex flex-col justify-center items-center">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl font-bold shingo">Meal Page</div>
              <p className=" text-2xl py-4">Here you can log a meal.</p>
            </div>
          </div>
        </div>

        <form
          className="flex w-full flex-col justify-start py-8 items-center h-full space-y-4 max-w-md"
          onSubmit={handleSubmit}
        >
          {/* //! Meal Name Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="name"
              placeholder="Name*"
            />
          </label>

          {/* //! Meal Calories Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              min={0}
              name="calories"
              placeholder="Calories* (kcal)"
            />
          </label>

          {/* //! Meal Carbs Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="carbs"
              min={0}
              placeholder="Carbs* (g)"
            />
          </label>

          {/* //! Meal Carbs Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="total_fat"
              min={0}
              placeholder="Total Fat* (g)"
            />
          </label>

          {/* //! Saturated Fat Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="sat_fat"
              min={0}
              placeholder="Saturated Fat (g)"
            />
          </label>

          {/* //! Trans Fat Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="trans_fat"
              min={0}
              placeholder="Trans Fat (g)"
            />
          </label>

          {/* //! Fiber Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="carbs_fiber"
              min={0}
              placeholder="Fiber (g)"
            />
          </label>

          {/* //! Sugars Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="carbs_sugar"
              min={0}
              placeholder="Sugars (g)"
            />
          </label>

          {/* //! Protein Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="protein"
              min={0}
              placeholder="Protein* (g)"
            />
          </label>

          {/* //! Sodium Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="sodium"
              min={0}
              placeholder="Sodium (mg)"
            />
          </label>

          <button className="btn btn-primary w-full max-w-sm">Submit</button>
        </form>
      </div>
    </>
  );
}
