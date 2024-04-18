import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//* Created by: Ariana Martell

// Adds a meal to the user's data on the server.
async function addMealToUser(meal) {
  try {
    const response = await fetch('/api/meal', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      // Converts the `meal` object into a JSON string
      body: JSON.stringify(meal),
    });

    if (!response.ok) {
      toast.error("Failed to add meal");
      const resp = await response.text();
      console.log(resp);
      return;
    } else {
      toast.success('Successfully added recent meal!');
    }
  } catch (e) {
    throw e;
  }
}
{/* //! Meal quick add component */}
function MealForm(meal) {
  return (
    <div className="m-2 border-2 border-dashed border-info rounded p-2">
      <h3 className="text-2xl text-neutral-content mb-2">{meal.name}</h3>
      <form action="/meal" method="POST">
        <button
          className="btn btn-info btn-xs"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            addMealToUser(meal);
          }}
        >
          Quick Add
        </button>
      </form>
    </div>
  );
}

export default function QuickCard({ title, recents }) {
  const dialog = useRef(null);
  const navigate = useNavigate();

  const MakeRecent = (items) => {
    return <>{items.map(MealForm)}</>;
  };

  function openDialog() {
    dialog.current?.showModal();
  }
  function closeDialog() {
    dialog.current?.close();
  }


  function handleChoice(e) {
    const choice = e.target.value;
    switch (choice) {
      case 'lookup':
        navigate('/lookup');
        break;
      case 'create':
        navigate('/meal');
        break;
      case 'recent':
        // Open popup...
        openDialog();
        break;
      case 'staple':
        navigate('/staple');
      default:
        break;
    }
  }

  return (
    <>
      <dialog ref={dialog} id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <p className="py-4 flex flex-row flex-wrap justify-center items-center">
            {recents.map(MealForm)}
          </p>
        </div>
      </dialog>
      <div className="card xl:w-[32cqw] xl:mx-5 w-full my-4 bg-neutral shadow-2xl">
        <div className="card-body">
          <h2 className="mb-2 card-title justify-center text-lg xl:text-4xl">
            {title}
          </h2>
          <div className="card-actions justify-center">
            <div className="join">
              <span className="material-symbols-outlined border-2 border-dashed border-accent bg-base-200 text-accent px-4 join-item flex justify-center items-center w-12 h-12">
                add_circle
              </span>
              <select
                onChange={handleChoice}
                className="select w-full  select-accent join-item"
              >
                <option value="" disabled selected>
                  Log a meal
                </option>
                <option value="create">Create Meal</option>
                <option value="recent">Enter Recent Meal</option>
                <option value="lookup">Lookup Meal</option>
                <option value="staple">Staple Foods</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
