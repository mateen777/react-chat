import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import add from "../Images/add.png";
import more from "../Images/more.png";
import cam from "../Images/cam.png";
import Hrx1 from "../Images/Hrx1.jpg";
import { ChatContext } from "./context/ChatContext";

function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <div className="flex-[2.5_1_0%] xs:hidden sm:hidden  bg-p4 border-l-2 border-[#E5B8F4]">
      <div className={`flex items-center justify-between px-4 py-3 bg-p2 h-[72px]`}>
            <div
              className={`items-center ${
                data.user?.photoURL ? "flex" : "hidden"
              }`}
            >
              <img
                src={data.user?.photoURL ? data.user?.photoURL : Hrx1}
                className="rounded-full h-12 w-12 min-w-[48px] min-h-[48px] object-cover object-center mr-3"
                alt="Profile Image"
              />
              <span className="font-sans font-bold text-[#E5B8F4] text-lg">
                {data.user?.displayName}
              </span>
            </div>
      </div>
      <div className="overflow-y-scroll py-2 px-3 scroll-smooth scrollbar-hide messages chats_scrollbar">
        <Messages />
      </div>
      <Input />
    </div>
  );
}

export default Chat;
