import React, { useContext,useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { ChatContext } from "../components/context/ChatContext";

function Message({message}) {

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [timePassed, setTimePassed] = useState(0);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  
  }, [message]);

  function getTimeDate(timestamp){

    var date = new Date(timestamp * 1000);
    var dateString = date.toLocaleDateString();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    let ampm = 'AM';
    if (hours >= 12) {
      ampm = 'PM';
    }

    const hours_in_12 = hours % 12 || 12; // Convert 0 to 12

    var timeString = hours_in_12+':'+minutes+ampm;
    return timeString;
  }

  console.log(message);
  return (
    <>
    {message && 
        <div ref={ref} className='mb-2 px-8'>
        <div className={`flex gap-2 ${message?.senderId === currentUser?.uid ?'justify-end': "justify-start"} `} >
            <div className={` bg-white rounded-b-md message mr-0 mt-1 relative ${message && message?.senderId === currentUser?.uid ?'sent': "received"}`} >
                {message?.text && <p className={`bg-white rounded-b-md pt-[6px] mr-16 pb-1 pl-[9px] text-base max-w-max ${message?.senderId === currentUser?.uid ?'rounded-tl-md':'rounded-tr-md'}`}>{message?.text}</p>}
                {message?.img && 
                  <div className={`bg-white p-1 w-[240px] ${message?.senderId === currentUser?.uid ?'rounded-tl-md':'rounded-tr-md'} rounded-b-md`}> 
                    <img src={message.img} alt="" className="object-contain object-center mr-0 rounded-md" /> 
                  </div>
                }
                {message?.img && <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/50 to-black/0 rounded-b-md"></div>}
                <span className={`absolute float-right right-2 text-xs ${message.img ? 'text-white/80 bottom-[2px]' : 'text-black bottom-0'}`}>
                  {getTimeDate(message.date.seconds)}
                </span>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default Message