import { useEffect } from 'react';
import SwipeAnimation from '../components/swipe';

//* Created by: Ariana Martell
export default function Recipe() {
  useEffect(() => {
    document.title = 'Recipe';
  }, []);

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex flex-col items-center">
        <div className="hero bg-base-200 min-h-[20vh] w-full">
          <div className="hero-content items-center text-center">
            <div className="text-5xl text-wrap items-center text-center sm:text-left font-bold shingo">
              Look for a Recipe
            </div>
          </div>
        </div>
        <div className="items-center">
          <form
            action="/login"
            className="flex size-full flex-col justify-start px-8 mt-48 items-center space-y-4 max-w-md"
          >
            <textarea
              className="textarea textarea-success items-center h-48 xs:w-[20rem] md:w-[40rem] sm:w-[40rem] xl:w-[48rem]"
              placeholder="Enter ingredients on seperate lines"
            ></textarea>

            <button className="btn btn-primary w-full max-w-[5rem]">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
