import { useLoaderData } from 'react-router-dom';
import SwipeAnimation from '../components/swipe';
import DeletableRow from '../components/deletabletablerow';
//* Created by: Ariana Martell
export default function AllMeals() {
  const data = useLoaderData();

  console.log('All Meal');
  console.log(data);

  if (data.length === 0) {
    return (
      <>
        {' '}
        <SwipeAnimation />
        <div className="size-full flex flex-col items-center min-w-lg">
          <div className="hero bg-base-200 min-h-[20vh]">
            <div className="hero-content text-center">
              <div className="max-w-xl">
                <div className="text-5xl font-bold">No meals logged today!</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SwipeAnimation />
      <div className="size-full flex flex-col items-center min-w-lg">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-xl">
              <div className="text-5xl font-bold">Today's Logged Meals</div>
            </div>
          </div>
        </div>

        <section className="size-full flex justify-start items-center flex-col max-w-8xl">
          <div className="overflow-x-auto w-full h-full flex justify-center items-start">
            <table>
              <thead>
                <tr className="text-left">
                  <th className="w-24">Name</th>
                  <th className="w-24">Calories</th>
                  <th className="w-24">Carbs</th>
                  <th className="w-24">Total Fat</th>
                  <th className="w-24">Sat Fat</th>
                  <th className="w-24">Trans Fat</th>
                  <th className="w-24">Carbs Fiber</th>
                  <th className="w-24">Carbs Sugar</th>
                  <th className="w-24">Protein</th>
                  <th className="w-24">Sodium</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* Dynamically render rows from the data array if available */}
                {data && data.length > 0
                  ? data.map((meal) => <DeletableRow meal={meal} />)
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
