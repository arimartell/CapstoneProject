import { useEffect } from 'react';
import SwipeAnimation from '../components/swipe';
import egg from "../egg.png";
import bagel from "../bagel.png";
import chicken from "../chicken.png";
import steak from "../steak.png";
import bread from "../bread.png"
import rice from "../rice.png"

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
              <div className="text-5xl font-bold shingo md:shrink-0">
                Add a staple food
              </div>
              <p className="text-2xl py-4">
                Here you can quickly add a common staple food
              </p>
            </div>
          </div>
        </div>

        <form
          action="/login"
          className="flex w-full flex-col justify-center py-8 items-center h-full space-y-4 max-w-md"
        >
          {/* //! Egg Input */}
          <label className="flex justify-around flex-row items-center form-control gap-2 w-full">
          <img src={egg} className='w-8 h-8'/>
            <input
              className="input input-bordered w-full"
              type="number"
              min={0}
              name="eggs"
              placeholder="Eggs"
            />
          </label>

          {/* //! Bagel Input */}
          <label className="flex justify-around flex-row form-control gap-2 w-full">
          <img src={bagel} className='w-8 h-8'/>
            <input
              className="input input-bordered w-full"
              type="number"
              name="bagel"
              min={0}
              placeholder="Bagel"
            />
          </label>

          {/* //! Chicken Input */}
          <label className=" flex justify-around flex-row form-control gap-2 w-full">
          <img src={chicken} className='w-8 h-8'/>
            <input
              className="input input-bordered w-full"
              type="number"
              name="chicken"
              min={0}
              placeholder="Chicken (120g)"
            />
          </label>

          {/* //! Steak Input */}
          <label className="flex justify-around flex-row form-control gap-2 w-full">
          <img src={steak} className='w-8 h-8'/>
            <input
              className="input input-bordered w-full"
              type="number"
              name="steak"
              min={0}
              placeholder="Steak (220g)"
            />
          </label>

          {/* //! Bread Input */}
          <label className="flex justify-around flex-row form-control gap-2 w-full">
          <img src={bread} className='w-8 h-8'/>
            <input
              className="input input-bordered w-full"
              type="number"
              name="trans_fat"
              min={0}
              placeholder="Bread (1 slice)"
            />
          </label>

          {/* //! Rice Input */}
          <label className="flex justify-around flex-row form-control gap-2 w-full">
          <img src={rice} className='w-8 h-8'/>
            <input
              className="input input-bordered w-full"
              type="number"
              name="Rice"
              min={0}
              placeholder="Rice (160g)"
            />
          </label>

          <button className="btn btn-primary w-full max-w-sm">Submit</button>
        </form>
      </div>
    </>
  );
}
