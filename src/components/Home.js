import React from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';

function Home() {
  return (
    <div className='h-screen bg-[#2D033B] flex'>
        <Sidebar />
        <Chat />
    </div>
  )
}

export default Home