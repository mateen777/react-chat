import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { auth } from "../../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState();
    const [checkingStatus, setCheckingStatus] = useState(true);


    // const getSessionExpirationTime = async () => {
    //   const user = auth.currentUser;
    //   if (user) {
    //     user.getIdTokenResult().then((token)=>{
    //         console.log(token)
    //         return token;
    //     }).catch();

        
    //   } else {
    //     return null;
    //   }
    // };

    useEffect(()=>{
     const unsub = onAuthStateChanged(auth, (user) => {
       if (user) {
          setCurrentUser(user);
          // console.log('Expiration=',getSessionExpirationTime());
        }else{
          setCurrentUser(null);
        }
        setCheckingStatus(false);
    })
    console.log('checkingStatus:-', checkingStatus);
      return () =>{
        unsub();
      };
    },[]);

    return(
    <AuthContext.Provider value={{ currentUser,checkingStatus }}>
        {children}
    </AuthContext.Provider>
    )
}