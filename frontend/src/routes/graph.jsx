import { useEffect } from 'react';
import SwipeAnimation from '../components/swipe';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

//* Created by: Ariana Martell
export default function Graph() {
  useEffect(() => {
    document.title = 'Graphs';
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <SwipeAnimation />
      <div className="size-full min-h-screen flex flex-col items-center">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl text-nowrap font-bold shingo">Your Progress page</div>
            </div>
          </div>
        </div>

        <section class="size-full px-12 flex justify-center items-center flex-col space-y-16 py-4">

          <div>
            <p className="mt-12 sm:mt-32 md:mt-32 xl:mt-40 lg:mt-32 2xl:mt-32  text-xl font-bold ">Goal</p>
            <div className="relative flex justify-center items-center">
              <progress
                class="progress progress-accent w-80 h-6"
                value="70"
                max="100"
              ></progress>
              <span className="absolute self-center text-black">50%</span>
            </div>
          </div>

          <div className="flex flex-row justify-evenly items-center size-full flex-wrap">
            <div className="w-[800px] h-[400px]">
              <Chart type="line" data={data} />
            </div>
            <div className="w-[800px] h-[400px]">
              <Chart type="line" data={data} />
            </div>
            <div className="w-[800px] h-[400px] mt-12 xl:mt-0">
              <Chart type="line" data={data} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
