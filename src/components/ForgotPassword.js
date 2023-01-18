import React, { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setFormErrors(validate(email))
    if (Object.keys(validate(email)).length === 0) {
      sendPasswordResetEmail(auth, email)
        .then((response) => {
          // Password reset email sent!
          alert(`Reset Password Link Successfully sent to ${email}`)
          navigate("/login")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // ..
        });
    }
  };

  useEffect(() => {}, []);

  const validate = (email) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // console.log(email);
    if (!email) {
      errors.email = "Email is required!";
    } else if (!regex.test(email)) {
      errors.email = "This is not a valid email format!";
    }
    setFormErrors(errors);
    return errors;
  };

  return (
    <div className="h-screen bg-[#2D033B] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#810CA8] rounded-lg p-[28px] space-y-2 text-[#E5B8F4] font-sans"
      >
        <h1 className="text-2xl font-bold mb-7">
          Forgot Password
        </h1>
        <div className="min-h-[72px]">
          <input
            className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
              formErrors.email
                ? "border-[#C147E9] placeholder-[#C147E9]"
                : "border-[#C147E9] placeholder-[#C147E9]"
            }`}
            name="email"
            placeholder="Enter Email Here...."
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // validate(e.target.value);
            }}
          />
          {formErrors.email && (
            <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
              {formErrors.email}
            </p>
          )}
        </div>
        <div className="text-center sign-in">
          <button
            className="h-12 font-sans text-[#C147E9] bg-[#2D033B] hover:bg-[#2D033B]/75 mx-auto transition-all flex items-center justify-center align-middle text-2xl font-semibold p-2 w-3/4 rounded-lg"
            style={{ outline: "none" }}
            type="submit"
          >
            Send Link
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
