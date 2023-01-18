import React from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Home from "./components/Home";
import { useContext } from "react";
import { AuthContext } from "./components/context/AuthContext";
// import { Timestamp } from "firebase/firestore";
import Loader from "./components/Loader";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";

function App(props) {

  const {currentUser, checkingStatus} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {

    if (checkingStatus) {
      console.log(currentUser);
      return <Loader />
    }
    else{
      if (!currentUser) {
        return <Navigate to={"/login"} />
      }
      console.log(currentUser)
      return children;
    }
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
              } />
            <Route path="login" element={<SignIn />} />
            <Route path="register/:signup" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
