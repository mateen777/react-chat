import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../components/context/ChatContext";
import { db } from "../firebase";
import Message from './Message'

function Messages() {

  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);
  return (
    <>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </>
  )
}

export default Messages