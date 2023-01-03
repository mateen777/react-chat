import React, { useState, useEffect } from "react";
import file from "../Images/file_upload.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const initialValues = { username: "", email: "", password: "", file: {} };

  const [formValues, setFormvalues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [imagePath, setImagepath] = useState("");
  const [apiError, setApiError] = useState();
  const navigate = useNavigate();

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
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        const res = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);

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
        (error) => {
          
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
            console.log("File available at", downloadURL);
            await updateProfile(res.user,{
              displayName:formValues.username,
              photoURL:downloadURL
            })
            // Add a new document in collection "cities"
            await setDoc(doc(db, "users", res.user.uid), {
              uid:res.user.uid,
              displayName:formValues.username,
              email:formValues.email,
              photoURL:downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/login")
          });
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
    return errors;
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
        <div className="min-h-[72px]">
          <input
            className={`username bg-transparent border-b-[3px] outline-none text-[#E5B8F4] font-medium h-[48px] ${
              formErrors.password
                ? "border-[#C147E9] placeholder-[#C147E9]"
                : "border-[#C147E9] placeholder-[#C147E9]"
            }`}
            placeholder="Password"
            name="password"
            type="password"
            id="password"
            value={formValues.password}
            onChange={changeHandler}
          />
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
