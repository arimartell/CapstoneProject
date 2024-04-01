import { useEffect } from 'react';
import SwipeAnimation from '../components/swipe';

//* Created by: Ariana Martell
export default function Lookup() {
  useEffect(() => {
    document.title = 'Lookup';
  }, []);

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex flex-col items-center">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl font-bold shingo">Lookup a meal</div>
              <p className="py-4 text-2xl">
                If you're uncertain about the macronutrient composition of your
                meals, feel free to search for it
              </p>
            </div>
          </div>
        </div>

        <form
          action="/login"
          className="flex size-full flex-col justify-start px-8 mt-48 items-center space-y-4 max-w-md"
        >
          <label className="input input-bordered flex items-center gap-2">
            <input
              className="grow"
              type="text"
              name="name"
              placeholder="Search food"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          <button className="btn btn-primary w-full max-w-[5rem]">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
