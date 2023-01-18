import React, { useContext} from 'react'
import { useState } from 'react';
import attach from '../Images/attach.png';
import image from '../Images/img.png';
import { AuthContext } from "../components/context/AuthContext";
import { ChatContext } from "../components/context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Input() {
  
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed', {
        'complete': function() {
        console.log('upload complete!');
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
        }
        });

      // uploadTask.on('state_changed',
      //     (snapshot) => {
      //       const progress =
      //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //       console.log("Upload is " + progress + "% done");
      //       switch (snapshot.state) {
      //         case "paused":
      //           console.log("Upload is paused");
      //           break;
      //         case "running":
      //           console.log("Upload is running");
      //           break;
      //       }
      //     },
      //   (error) => {
      //     // TODO:Handle Error
      //     console.log(error);
      //   },
      //   () => {
      //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      //       await updateDoc(doc(db, "chats", data.chatId), {
      //         messages: arrayUnion({
      //           id: uuid(),
      //           text,
      //           senderId: currentUser.uid,
      //           date: Timestamp.now(),
      //           img: downloadURL,
      //         }),
      //       });
      //     });
      //   }
      // );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setImg(file);
    }
    else{
      setImg(null);
    }
  };

  return (
    <div className='flex items-center justify-between bg-white px-3'>
        <input
          className='w-full outline-none text-p1 p-1 font-medium h-[52px]'
          type="text"
          placeholder="Type Somthing...."
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={(e)=>{
            let key = e.keyCode || e.which;
            if(key === 13){
              handleSend()
            }
          }}
        />
        <div className='flex items-center gap-5'>
            <label htmlFor="attach">
                <img src={attach} alt="" className='min-w-[32px] h-[28px]' />
                <input
                className='hidden'
                type="file"
                id="attach"
                // accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}

                />
            </label>
            <label htmlFor="attach">
                {/* <input type="file" name="image" id="image" accept=".jpg, .jpeg, .png" className='hidden'
                onChange={(e) => setImg(e.target.files[0])}
                /> */}
                <img src={image} alt="" className='min-w-[32px] h-[28px]'/>
            </label>
            <button className='bg-p1 text-white px-7 py-2 rounded disabled:opacity-50' disabled={(!text && img === null)} onClick={handleSend} >Send</button>
        </div>
    </div>
  )
}

export default Input