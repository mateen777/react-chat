import { signOut } from 'firebase/auth'
import React from 'react'
import { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {

  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
      navigate("/profile");
  }

  return (
    <div className='flex items-center justify-between px-4 py-3 bg-[#810CA8]'>
        <div className='flex items-center justify-between' onClick={handleClick}>
            <img src={currentUser?.photoURL} className="rounded-full h-12 w-12 min-w-[48px] min-h-[48px] object-cover object-center mr-3"  alt="Profile Image" />
            <span className='font-sans font-bold text-[#E5B8F4]'>{currentUser?.displayName}</span>
        </div>
        <button className="font-sans text-[#E5B8F4] bg-[#2D033B] flex text-base font-semibold px-2 py-[6px] rounded-lg outline-none"
         type="button" onClick={() => signOut(auth)}>Logout
         </button>
    </div>
  )
}

export default Navbar