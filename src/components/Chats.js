import React from 'react';
import { useEffect,useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ChatContext } from "./context/ChatContext";

function Chats() {
  const [chats,setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(()=>{
    const getChats = () =>{
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        console.log("Current data: ", doc.data());
        setChats(doc.data());
        console.log(chats);
        return () => {
          unsub();
        }
    });
    }
    currentUser?.uid && getChats();
  },[currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className='bg-p1'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) =>(

        <div className="flex items-center gap-4 px-3 py-2 cursor-pointer" 
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" className='min-w-[40px] w-10 h-10 object-cover rounded-full'/>
          <div className="text-p1 w-full text-left overflow-hidden">
              <span className='font-sans font-bold text-p4'>{chat[1].userInfo.displayName}</span>
              <p className='text-p4 overflow-hidden text-ellipsis whitespace-nowrap'>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
        ))
      }
      </div>
  )
}

export default Chats