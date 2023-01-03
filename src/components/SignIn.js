import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate,Link } from "react-router-dom";


const SignIn = (props) => {
  const initialValues = { email: "", password: "" };

  const navigate = useNavigate();
  const [formValues, setFormvalues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [apiError,setApiError] = useState();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormvalues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    try {
     const res = await signInWithEmailAndPassword(auth,formValues.email, formValues.password)
      console.log(res);
      navigate("/")
    } catch (error) {
      console.log(error.message);
      setApiError(error.message);
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passregex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password Atleast 8 characters";
    } else if (!passregex.test(values.password)) {
      errors.password = "Password not valid";
    }
    return errors;
  };

  return (
      <div className="h-screen bg-[#2D033B] flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-[#810CA8] rounded-lg p-[28px] space-y-4 text-[#E5B8F4] font-sans"
          >
            <h1 className="text-2xl font-bold tracking-[1px] mb-7">
            Login
          </h1>
          <div className="min-h-[72px]">
            <input
              className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
                formErrors.email
                  ? "border-[#C147E9] placeholder-[#C147E9]"
                  : "border-[#C147E9] placeholder-[#C147E9]"
              }`}
              placeholder="Email"
              name="email"
              type="email"
              id="email"
              value={formValues.email}
              onChange={changeHandler}
            />
            {formErrors.email && <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">{formErrors.email}</p>}
          </div>
          <div className="min-h-[72px]">
            <input
              className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
                formErrors.password? "border-[#C147E9] placeholder-[#C147E9]": "border-[#C147E9] placeholder-[#C147E9]"}`}
              placeholder="Password"
              name="password"
              type="password"
              id="password"
              value={formValues.password}
              onChange={changeHandler}
            />
            {formErrors.password && <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">{formErrors.password}</p>}
            {apiError && <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">{apiError}</p>}
          </div>
          <div className="text-center sign-in">
            <button
              className="h-12 font-sans text-[#C147E9] bg-[#2D033B] hover:bg-[#2D033B]/75 mx-auto transition-all flex items-center justify-center align-middle text-2xl font-semibold p-2 w-3/4 rounded-lg"
              style={{ outline: "none" }}
              type="submit"
            >
              Sign in
            </button>
          </div>
          <p >You don't have an account? <Link to="/register"><span className="cursor-pointer font-medium hover:underline decoration-2 decoration-pink-500 text-[#E5B8F4]">Register</span></Link></p>
          </form>
      </div>
  );
};

export default SignIn;
