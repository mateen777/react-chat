import React from 'react'
import Messages from './Messages'
import Input from './Input'
import add from '../Images/add.png'
import more from '../Images/more.png'
import cam from '../Images/cam.png'

function Chat() {
  return (
    <div className='flex-[2.5_1_0%] xs:hidden sm:hidden bg-p4 border-l-2 border-white'>
        <div className='flex items-center justify-between p-4 bg-p2 h-[72px]'>
            <span className='font-sans font-bold text-[#E5B8F4] text-lg'>Mateen</span>
            <div className='flex items-center gap-[10px]'>
                <img src={cam} alt="Camera btn"  className='w-8 h-8'/>
                <img src={add} alt="Add btn" className='w-8 h-8'/>
                <img src={more} alt="More btn" className='w-8 h-8'/>
            </div>
        </div>
        <div className='overflow-scroll p-2 scroll-smooth scrollbar-hide messages'>
            <Messages/>
        </div>
            <Input/>
    </div>
  )
}

export default Chat