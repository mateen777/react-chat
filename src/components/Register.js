import React, { useState, useEffect } from "react";
import file from "../Images/file_upload.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link, useParams } from "react-router-dom";

function Register() {
  const initialValues = { username: "", email: "", password: "", file: {} };

  const [formValues, setFormvalues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [imagePath, setImagepath] = useState("");
  const [apiError, setApiError] = useState();
  const [type, setType] = useState("password");
  const navigate = useNavigate();
  let { signup } = useParams();

  const changeHandler = (e) => {
    const { name, value, files } = e.target;
    setFormvalues({
      ...formValues,
      [name]:
        e.target.type === "file"
          ? files[0]?.size < 1000000
            ? files[0]
            : formValues.file
          : value,
    });
    if (e.target.type === "file" && files[0] && files[0]?.size < 1000000) {
      readFile(files[0]);
    }
    console.log(name, value, imagePath);
    console.log(formValues);
  };

  const readFile = (file) => {
    // const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const { result } = e.target;
      setImagepath(result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(e.target)
    setFormErrors(validate(formValues));
    setIsSubmit(true);

    try {
      if (Object.keys(formErrors).length === 0) {
        const res = await createUserWithEmailAndPassword(
          auth,
          formValues.email,
          formValues.password
        );

        const storageRef = ref(storage, formValues.username);
        const uploadTask = uploadBytesResumable(storageRef, formValues.file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                await updateProfile(res.user, {
                  displayName: formValues.username,
                  photoURL: downloadURL,
                });
                // Add a new document in collection "users"
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName: formValues.username,
                  email: formValues?.email,
                  photoURL: downloadURL,
                  phoneNumber:formValues?.number
                });

                await setDoc(doc(db, "userChats", res.user.uid), {});
                navigate("/login");
              }
            );
          }
        );
        console.log(res);
      }
    } catch (error) {
      console.log(error);
      setApiError(error);
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
    if (!values.username) {
      errors.username = "Display Name is required!";
    }
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
    if (values.file && values.file.size > 1000000) {
      errors.file = "File is Greater than 1MB";
    }
    if (!values.number) {
      errors.number = "Number is required!";
    } else if (values.number.length < 10) {
      errors.number = "Number Atleast 10 Digits";
    }

    return errors;
  };

  const passwordHandle = () => {
    if (type == "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  return (
    <div className="h-screen bg-[#2D033B] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#810CA8] rounded-lg p-[28px] space-y-2 text-[#E5B8F4] font-sans"
      >
        <h1 className="text-2xl font-bold tracking-[1px] mb-7">Sign Up</h1>
        <div className="min-h-[72px]">
          <input
            className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
              formErrors.username
                ? "border-[#C147E9] placeholder-[#C147E9]"
                : "border-[#C147E9] placeholder-[#C147E9]"
            }`}
            name="username"
            placeholder="Display Name"
            type="text"
            id="username"
            value={formValues.username}
            onChange={changeHandler}
          />
          {formErrors.username && (
            <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
              {formErrors.username}
            </p>
          )}
        </div>
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
            {type == 'password' ? 
              <path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" /> :
              <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/>
            }
          </svg>
          {formErrors.password && (
            <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
              {formErrors.password}
            </p>
          )}
        </div>
        <div className="">
          <label
            htmlFor="file"
            className="flex items-center justify-start gap-14 cursor-pointer"
          >
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              accept=".jpg, .jpeg, .png"
              onChange={changeHandler}
            />
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg> */}
            <img
              src={imagePath ? imagePath : file}
              className={`ml-4 h-[52px] w-[52px] ${
                imagePath ? "rounded-full object-cover object-center" : ""
              }`}
              alt="file_upload logo"
            />
            <span className="font-medium text-[18px] text-[#C147E9]">
              Add Avatar
            </span>
          </label>
          {formErrors.file && (
            <p className="text-sm ml-2 mt-1 text-[#E5B8F4]">
              {formErrors.file}
            </p>
          )}
        </div>
        <div className="text-center sign-in">
          <button
            className="h-12 font-sans text-[#C147E9] bg-[#2D033B] hover:bg-[#2D033B]/75 mx-auto transition-all flex items-center justify-center align-middle text-2xl font-semibold p-2 w-3/4 rounded-lg"
            style={{ outline: "none" }}
            type="submit"
          >
            Sign Up
          </button>
        </div>
        {apiError && <p>{apiError}</p>}
        <p>
          You do have an account?{" "}
          <Link to="/login">
            <span className="cursor-pointer font-medium hover:underline decoration-2 decoration-pink-500 text-[#E5B8F4]">
              Login
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
