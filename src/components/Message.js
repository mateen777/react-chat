import React from 'react'
import img2 from '../Images/img2.jpg';
import Hrx1 from '../Images/Hrx1.jpg';

function Message() {
  return (
    <div className='mb-5'>
        <div className={`flex gap-2 `} >
            <div className="flex flex-col items-center">
                <img src={img2} alt="" className='min-w-[40px] w-10 h-10 object-cover rounded-full'/>
                {/* <span className='text-sm'>just now</span> */}
            </div>
            <div className='mr-0 mt-1'>
                {/* <p className='bg-white p-1 rounded-tr-md rounded-tl-none rounded-b-md max-w-max'>{'Hello,How are You?'}</p> */}
                {/* {message.img && <img src={message.img} alt="" />} */}
                <img src={Hrx1} alt="" className='h-80 object-contain object-center mr-0 rounded-tr-md rounded-tl-none rounded-b-md' />
            </div>
        </div>
    </div>
//     <div className={`flex gap-2 `} >
//     <div className="flex flex-col items-center">
//         <img src={img2} alt="" className='min-w-[40px] w-10 h-10 object-cover rounded-full'/>
//         {/* <span className='text-sm'>just now</span> */}
//     </div>
//     <div className='mr-0 mt-1'>
//         {/* <p className='bg-white p-1 rounded-tr-md rounded-tl-none rounded-b-md max-w-max'>{'Hello,How are You?'}</p> */}
//         {/* {message.img && <img src={message.img} alt="" />} */}
//         <img src={img2} alt="" className='h-80 object-contain object-center mr-0 rounded-tr-md rounded-tl-none rounded-b-md' />
//     </div>
// </div>
  )
}

export default Message