import React from 'react'
import Navbar from './Navbar';
import Chats from './Chats';
import Search from './Search';

function Sidebar() {
  return (
    <div className='flex-[1_1_0%] sm:min-w-full min-w-[370px] max-w-[390px] bg-white'>
        <Navbar/>
        <Search/>
        <hr />
        <Chats/>
    </div>
  )
}

export default Sidebar