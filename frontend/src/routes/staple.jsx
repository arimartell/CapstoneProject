import { useEffect } from 'react';
import SwipeAnimation from '../components/swipe';

//* Created by: Ariana Martell
export default function Staple() {
  useEffect(() => {
    document.title = 'Staple';
  }, []);

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex flex-col justify-center items-center">
        <div className="hero bg-base-200 ">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl font-bold shingo md:shrink-0">Add a staple food</div>
              <p className=" text-2xl py-4">Here you can quickly add a common staple food</p>
            </div>
          </div>
        </div>

        <form
          action="/login"
          className="flex w-full flex-col justify-center py-8 items-center h-full space-y-4 max-w-md"
        >

          {/* //! Egg Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              min={0}
              name="eggs"
              placeholder="Eggs (kcal)"
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



          <button className="btn btn-primary w-full max-w-sm">Submit</button>
        </form>
      </div>
    </>
  );
}
