import React from 'react'
import attach from '../Images/attach.png';
import image from '../Images/img.png';

function Input() {
  return (
    <div className='flex items-center justify-between bg-white px-3'>
        <input
          className='w-full outline-none text-p1 p-1 font-medium h-[52px]'
          type="text"
          placeholder="Type Somthing...."
        />
        <div className='flex items-center gap-5'>
            <label htmlFor="attach">
                <img src={attach} alt="" className='min-w-[32px] w-[58px] h-[28px]' />
                <input
                className='hidden'
                type="file"
                id="attach"
                // onChange={(e) => setImg(e.target.files[0])}
                />
            </label>
            <label htmlFor="image">
                <input type="file" name="image" id="image" accept=".jpg, .jpeg, .png" className='hidden' />
                <img src={image} alt="" className='min-w-[32px] w-[56px] h-[28px]'/>
            </label>
            <button className='bg-p1 text-white px-7 py-2 rounded'>Send</button>
        </div>
    </div>
  )
}

export default Input