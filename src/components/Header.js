import React from 'react'

function Header() {
  return (
    <div>
      <div className="h-auto p-[28px] bg-gradient-to-b from-[#E5B8F4] to-[#2D033B] rounded-t-lg">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col space-y-5 text-white font-semibold"
        >
          <h1 className="text-2xl font-extrabold tracking-[1px] text-white">
            Sign In
          </h1>
          <div className="text-left">
            <label className="block ml-2 mb-[2px]" htmlFor="username">
              Username
            </label>
            <input
              className={`username rounded-full h-[48px] ${
                formErrors.username
                  ? "outline outline-[3px] outline-white outline-offset-4"
                  : "outline-none outline-offset-2 outline-2"
              }`}
              name="username"
              placeholder="Enter Your Name"
              type="text"
              id="username"
              value={formValues.username}
              onChange={changeHandler}
            />
            <p className="text-sm ml-2 mt-1">{formErrors.username}</p>
          </div>
          <div className="text-left">
            <label className="block ml-2 mb-[2px]" htmlFor="email">
              Email
            </label>
            <input
              className={`username rounded-full h-[48px] ${
                formErrors.email
                  ? "outline outline-[3px] outline-white outline-offset-4"
                  : "outline-none outline-offset-2 outline-2"
              }`}
              placeholder="Enter Your Email"
              name="email"
              type="email"
              id="email"
              value={formValues.email}
              onChange={changeHandler}
            />
            <p className="text-sm ml-2 mt-1">{formErrors.email}</p>
          </div>
          <div className="text-left">
            <label className="block ml-2 mb-[2px]" htmlFor="password">
              Password
            </label>
            <input
              className={`username rounded-full h-[48px] ${
                formErrors.password
                  ? "outline outline-[3px] outline-white outline-offset-4"
                  : "outline-none outline-offset-2 outline-2"
              }`}
              placeholder="Enter Your Password"
              name="password"
              type="password"
              id="password"
              value={formValues.password}
              onChange={changeHandler}
            />
            <p className="text-sm ml-2 mt-1">{formErrors.password}</p>
          </div>
          <div className="text-center sign-in">
            <button
              className="h-12 leading-none border-[3px] border-pink-500 mx-auto transition-all hover:from-pink-500 hover:to-white flex items-center justify-center align-middle text-2xl font-extrabold bg-clip-text text-transparent p-2 w-36 rounded-full bg-gradient-to-r from-white via-pink-300 to-pink-500"
              style={{ outline: "none" }}
              type="submit"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Header