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
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">

              <div className="text-5xl text-nowrap items-center font-bold shingo">Look for Recipe with Ingredients you Have </div>

          </div>
        </div>

        <form
          action="/login"
          className="flex size-full flex-col justify-start px-8 mt-48 items-center space-y-4 max-w-md"
        >

          <textarea className="textarea textarea-success h-96 w-[48rem]" placeholder="Enter ingredients on seperate lines"></textarea>

          <button className="btn btn-primary w-full max-w-[5rem]">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
