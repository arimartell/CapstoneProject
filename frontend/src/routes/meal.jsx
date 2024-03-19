//* Created by: Ariana Martell
export default function Meal() {
  return (
    <>
      <div className="size-full min-h-screen flex flex-col justify-center items-center">
        <div className="hero bg-base-200 min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="text-5xl">Meal Page</div>
              <p class="py-4">Here you can log a meal.</p>
            </div>
          </div>
        </div>

        <form
          action="/login"
          className="flex w-full flex-col justify-start py-8 items-center h-full space-y-4 max-w-md"
        >
          {/* //! Meal Name Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="name"
              placeholder="Name *"
            />
          </label>

          {/* //! Meal Calories Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              min={0}
              name="calories"
              placeholder="Calories* (kcal)"
            />
          </label>

          {/* //! Meal Carbs Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="carbs"
              placeholder="Carbs* (g)"
            />
          </label>

          {/* //! Meal Carbs Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="total_fat"
              placeholder="Total Fat* (g)"
            />
          </label>

          {/* //! Saturated Fat Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="sat_fat"
              placeholder="Saturated Fat (g)"
            />
          </label>

          {/* //! Trans Fat Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="trans_fat"
              placeholder="Trans Fat (g)"
            />
          </label>

          {/* //! Fiber Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="carbs_fiber"
              placeholder="Fiber (g)"
            />
          </label>

          {/* //! Sugars Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="carbs_sugar"
              placeholder="Sugars (g)"
            />
          </label>

          {/* //! Protein Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="protein"
              placeholder="Protein* (g)"
            />
          </label>

          {/* //! Sodium Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="number"
              name="sodium"
              placeholder="Sodium (mg)"
            />
          </label>

          <button className="btn btn-primary w-full max-w-sm">Submit</button>
        </form>
      </div>
    </>
  );
}
