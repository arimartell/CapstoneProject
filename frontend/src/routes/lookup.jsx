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
      <div className="size-full min-h-screen flex flex-col justify-center items-center">
       

      <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="name"
              placeholder="Name *"
            />
          </label>

          <button className="btn btn-primary w-full max-w-sm">Submit</button>
      </div>
    </>
  );
}
