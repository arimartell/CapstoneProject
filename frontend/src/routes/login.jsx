//* Created by: Ariana Martell
export default function Login() {
  return (
    <>
      <div className=" size-full min-h-screen flex justify-center items-center">
        <form
          action="/login"
          className="flex w-full flex-col justify-center items-center h-full space-y-4 max-w-md"
        >
          <h3 className="text-4xl font-bold shingo">Login</h3>
          {/* Username Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="text"
              name="username"
              placeholder="Username"
            />
          </label>

          {/* Password Input */}
          <label className="form-control gap-2 w-full">
            <input
              className="input input-bordered w-full"
              type="password"
              name="password"
              placeholder="Password"
            />
            {/* Forget Password link*/}
            <div className="label">
              <span className="label-text-alt italic text-info">
                <a className="link link-info text-sm" href="#">
                  Forgot Password?
                </a>
              </span>
            </div>
          </label>

          <button className="btn btn-primary w-full max-w-sm">Login</button>
          {/* Create An Account link*/}
          <span className="italic text-info">
            <a className="link link-info text-sm" href="#">
              Create An Account
            </a>
          </span>
        </form>
      </div>
    </>
  );
}
