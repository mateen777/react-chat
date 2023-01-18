import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from './context/AuthContext'

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () =>{
    const userRef = collection(db, "users");

    // Create a query against the collection.
    const q = query(userRef, where("displayName", "==", username));
    try {
      await getDocs(q).then((res) => {
        
        if (!res.empty ) {
          res.forEach((doc) => {
            console.log(doc.id, " => ", doc.data(),doc.exists());
            setUser(doc.data());
            setErr(false);
          }); 
        }
        else{
          setUser(null);
          setErr(true);
        }
        
      })
      .catch((error) => {
        console.log(error)
      });

      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data(),doc.exists());
      //   // setUser(doc.data());
      // });
    } catch (error) {
      console.log(error)
      // setErr(true);
    }
    
  }

  const handleKey =async (e) => {
    // const value = e.target.value;
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("")
  };


  return (
    <div>
      <div className="">
        <input
          className="w-full outline-none text-p1 p-1 font-medium h-[48px]"
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => {
            setUsername(e.target.value);
            if(e.target.value === ''){
              setErr(false);
            }
          }}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div
          className="flex items-center gap-4 px-3 py-4 bg-p1 cursor-pointer"
          onClick={handleSelect}
        >
          <img
            src={user.photoURL}
            alt=""
            className="min-w-[40px] w-10 h-10 object-cover rounded-full"
          />
          <div className="text-p1">
            <span className="font-sans font-bold text-p4">
              {user.displayName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
