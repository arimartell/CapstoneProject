//* Created by: Ariana Martell
export default function Signup() {
  return (
    <>
      <div className=" size-full min-h-screen flex justify-center items-center flex-col">
        <form
          action="/signup"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold">Create an account</h3>
          {/* Username Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </label>

          {/* Email Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </label>

          {/* Confirm Email Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="email"
              name="confirm_email"
              placeholder="Confirm Email"
              required
            />
          </label>

          {/* Password Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </label>

          {/* Confirm Password Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              required
            />
          </label>

          <button className="btn btn-primary w-full max-w-sm">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}
