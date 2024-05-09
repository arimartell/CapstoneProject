//* Created by: Ariana Martell
export default function DeletableRow({ meal }) {
  console.log(meal);
  // Retrieve the authentication token from local storage.
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Cannot delete meal as user is not logged in');
    return;
  }
// Delete a meal by its ID.
  async function deleteMeal(mealID) {
    try {
      const resp = await fetch('/api/deletemeal', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetID: mealID }),
      });

      if (resp.ok) {
        const body = await resp.json();
        const { message } = body;
        console.log(message);
        // Toast saying "success" then refresh page after delay
      } else {
        const body = await resp.json();
        const { message } = body;
        // Bad toast
      }
    } catch (err) {
      throw err;
    }
  }
  // Return a table row displaying the meal details and a delete button.
  return (
    <tr className="hover">
      <td>{meal.name}</td>
      <td>{Math.round(meal.calories)}</td>
      <td>{Math.round(meal.carbs)}</td>
      <td>{Math.round(meal.total_fat)}</td>
      <td>{Math.round(meal.sat_fat)}</td>
      <td>{Math.round(meal.trans_fat)}</td>
      <td>{Math.round(meal.carbs_fiber)}</td>
      <td>{Math.round(meal.carbs_sugar)}</td>
      <td>{Math.round(meal.protein)}</td>
      <td>{Math.round(meal.sodium)}</td>
      <td>
        <button
          onClick={() => deleteMeal(meal.id)}
          className="btn btn-xs btn-error"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
