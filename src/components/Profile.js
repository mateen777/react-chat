import React from "react";
import { useState } from "react";
import { updatePhoneNumber, RecaptchaVerifier,PhoneAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function Profile() {
  const [number, setNumber] = useState("");
  const [verificationCode,setverificationCode ] = useState('');
  const [verificationId, setverificationId] = useState();
  
  
  const sendOtp = async () => {
    const applicationVerifier = new RecaptchaVerifier("recaptcha-container",{},auth);
    const provider = new PhoneAuthProvider(auth);
    let num = '+91' + number;
    try {
      const vId = await provider.verifyPhoneNumber(
        num,
        applicationVerifier
      );
        console.log(vId);
      setverificationId(vId);
    } catch (error) {
      console.log(error)
    }
  };

  const updateUserProfile = async ()=> {
    try {
      const phoneCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode)
      const res =  await updatePhoneNumber(auth.currentUser,phoneCredential)
        console.log(res);
    } catch (error) {
      console.log(error.message.split('/')[1].split(')')[0]);
    }
  }
  // console.log("first");
  return (
    <div className="w-full h-full">
      <input
        className="border-2"
        type="number"
        name=""
        id=""
        maxLength={10}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <button type="submit" onClick={sendOtp}>
        SendOTP
      </button>

      <input className="border-2" type="number" name="" id="" value={verificationCode}
        onChange={(e) => setverificationCode(e.target.value)}/>

      <button type="submit" onClick={updateUserProfile}>
        update
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Profile;
