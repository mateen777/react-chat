import React, { useState, useEffect } from "react";
import { auth,storage, db  } from "../firebase";
import { signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, collection,getDocs, query, where, } from "firebase/firestore";

const SignIn = (props) => {
  const initialValues = { email: "", password: "", number: "" };

  const navigate = useNavigate();
  const [formValues, setFormvalues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [apiError, setApiError] = useState();
  const [type, setType] = useState("password");
  const [signin, setSignIn] = useState("email");
  const [otp, setOtp] = useState('');
  const [confirmationResult, setconfirmationResult] = useState();



  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name !== "number") {
      setFormvalues({ ...formValues, [name]: value });
    } else {
      if (value.length <= 10) {
        setFormvalues({ ...formValues, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    if (signin === "email") {
      try {
        //  const persistent =  setPersistence(auth,browserSessionPersistence);
        const res = await signInWithEmailAndPassword(
          auth,
          formValues.email,
          formValues.password
        );
        navigate("/");
      } catch (error) {
        console.log(error.message);
        setApiError(error.message);
      }
    } else {
      try {
        const userRef = collection(db, "users");
        // Create a query against the collection.
        const q = query(userRef, where("displayName", "==", 'Matee'));
        console.log(q);
        await getDocs(q).then(async (res) => {
          console.log(res.empty);
          if (!res.empty ) {
            const applicationVerifier = new RecaptchaVerifier("recaptcha-container",{'size': 'invisible'},auth);
            const confirmResult = await signInWithPhoneNumber(auth,'+919980157010',applicationVerifier);
            setconfirmationResult(confirmResult);
          }
          else{
            setFormErrors({number:'Account is not registered'});
          }
         });
        
        console.log(confirmationResult);
        
      } catch (error) {
        console.log(error.message);
      }
      console.log(formValues.number);
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
    // eslint-disable-next-line
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passregex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    if (signin === 'email') {
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
    } else {
      if (!values.number) {
        errors.number = "Number is required!";
      } else if (values.number.length < 10) {
        errors.number = "Number Atleast 10 Digits";
      }
    } 
    return errors;
  };

  const passwordHandle = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const otpSubmit = () => {
    try {

        confirmationResult.confirm(otp).then(async (result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        // await setDoc(doc(db, "users", user.uid), {
        //   uid: user.uid,
        //   displayName: '',
        //   email: '',
        //   photoURL: '',
        // });
        // await setDoc(doc(db, "userChats", user.uid), {});
        navigate('/')
        // ...
      })
    
    } catch (error) {
      
    }
    
  }

  return (
    <div className="h-screen bg-[#2D033B] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#810CA8] rounded-lg p-[28px] space-y-4 text-[#E5B8F4] font-sans"
      >
        <div className="flex divide-x-2">
          <h1
            className={`text-2xl font-bold tracking-[1px] w-1/2 cursor-pointer relative ${
              signin === "email" ? "text-p1 email_border_animate" : ""
            }`}
            onClick={() => setSignIn("email")}
          >
            Email
          </h1>
          <h1
            className={`text-2xl font-bold tracking-[1px] w-1/2 cursor-pointer relative ${
              signin === "phone" ? "text-p1 phone_border_animate" : ""
            }`}
            onClick={() =>{
              
              setSignIn("phone")}
            }
          >
            Phone
          </h1>
        </div>
        {signin === "email" ? (
          <>
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
              {formErrors.email && (
                <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div className="min-h-[72px] relative">
              <input
                className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
                  formErrors.password
                    ? "border-[#C147E9] placeholder-[#C147E9]"
                    : "border-[#C147E9] placeholder-[#C147E9]"
                }`}
                placeholder="Password"
                name="password"
                type={type}
                id="password"
                value={formValues.password}
                onChange={changeHandler}
              />
              <svg
                className="w-7 h-12 cursor-pointer absolute right-0 top-0"
                fill="#C147E9"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                onClick={passwordHandle}
              >
                {type === "password" ? (
                  <path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" />
                ) : (
                  <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" />
                )}
              </svg>
              <p className="text-right">
                <Link to="/forgot-password">
                  <span className="text-sm cursor-pointer font-medium hover:underline decoration-2 decoration-pink-500 text-[#E5B8F4]">
                    Forgot Password
                  </span>
                </Link>
              </p>
              {formErrors.password && (
                <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
                  {formErrors.password}
                </p>
              )}
              {apiError && (
                <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">{apiError}</p>
              )}
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
            <p>
              You don't have an account?{" "}
              <Link to="/register/email">
                <span className="cursor-pointer font-medium hover:underline decoration-2 decoration-pink-500 text-[#E5B8F4]">
                  Register
                </span>
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="min-h-[72px]">
              <input
                className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
                  formErrors.email
                    ? "border-[#C147E9] placeholder-[#C147E9]"
                    : "border-[#C147E9] placeholder-[#C147E9]"
                }`}
                placeholder="Number..."
                name="number"
                type="number"
                id="number"
                min={1}
                maxLength={10}
                value={formValues.number}
                onChange={changeHandler}
                onKeyDown={(e) => {
                  if (e.keyCode === 38 || e.keyCode === 40) {
                    e.preventDefault();
                  }
                }}
              />
              {formErrors.number && (
                <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
                  {formErrors.number}
                </p>
              )}
            </div>
            <div id="recaptcha-container"></div>
            <div className="min-h-[72px]">
              <input
                className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
                  formErrors.number
                    ? "border-[#C147E9] placeholder-[#C147E9]"
                    : "border-[#C147E9] placeholder-[#C147E9]"
                }`}
                placeholder="OTP..."
                name="otp"
                type="number"
                id="otp"
                maxLength={6}
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
              />
              <button
                className="h-12 font-sans text-[#C147E9] bg-[#2D033B] hover:bg-[#2D033B]/75 mx-auto transition-all flex items-center justify-center align-middle text-2xl font-semibold p-2 w-3/4 rounded-lg"
                style={{ outline: "none" }}
                type="button"
                onClick={otpSubmit}
              >
                Submit
              </button>
            </div>
            <div className="text-center sign-in">
              <button
                className="h-12 font-sans text-[#C147E9] bg-[#2D033B] hover:bg-[#2D033B]/75 mx-auto transition-all flex items-center justify-center align-middle text-2xl font-semibold p-2 w-3/4 rounded-lg"
                style={{ outline: "none" }}
                type="submit"
              >
                {signin === 'phone'?'Send Otp..':'Sign in'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SignIn;
