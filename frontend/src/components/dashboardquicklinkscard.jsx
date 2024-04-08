import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickCard({ title }) {
  const dialog = useRef(null);
  const navigate = useNavigate();

  const makeRecent = (item) => {
    return <div>Details here...</div>;
  };

  function openDialog() {
    dialog.current?.showModal();
  }
  function closeDialog() {
    dialog.current?.close();
  }

  async function fetchRecent() {
    // await fetch('/getrecent') ...
    /*
    const items = fetchresults...
    const elements = items.map(makeRecent);
    Then update state with new elements to show in dialog
    */
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
          <div></div>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
      <div className="card w-[42cqw] min-w-lg m-5 bg-neutral shadow-2xl">
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
