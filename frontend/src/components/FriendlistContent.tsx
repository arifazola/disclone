import React from 'react'

const FriendlistContent = () => {
    return (
        <div id='sub-content-container' className='flex w-full h-full mt-5'>
            <div id='left-content' className='w-[70%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <div className='w-full h-12 bg-slate-200 rounded-lg flex items-center p-2'>
                    <span className='text-slate-500 text-lg'>Search</span>
                </div>

                <span>Online - 2</span>

                <div className='flex items-center gap-5'>
                    <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                        <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                    </div>
                    <span className='text-lg'>Friend 1</span>
                </div>

                <div className='flex items-center gap-5'>
                    <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                        <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                    </div>
                    <span className='text-lg'>Friend 1</span>
                </div>
            </div>
            <div id='right-content' className='w-[30%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <span className='font-bold text-xl'>Active Now</span>

                <div className='w-full h-50 shadow-lg rounded-lg border-1 border-slate-300 p-3'>
                    <div className='flex items-center gap-5'>
                        <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                            <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                        </div>
                        <span className='text-lg'>Friend 1</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendlistContent