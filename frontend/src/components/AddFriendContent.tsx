import React from 'react'
import ButtonPrimary from './ButtonPrimary'
import Button from './Button'

const AddFriendContent = () => {
    return (
        <div id='sub-content-container' className='flex w-full h-full mt-5'>
            <div id='left-content' className='w-[70%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-xl'>Add Friend</span>
                    <span>You can add friends with their username</span>
                </div>

                <div className='w-full h-12 bg-slate-200 rounded-lg flex items-center p-2'>
                    <input type='text' className='h-full w-[90%] outline-0' placeholder='Enter a username'></input>
                    <div className='w-[35%]'>
                        <Button text='Send Friend Request' onClick={() => console.log()} btnClass='bg-primary text-white text-sm' />
                    </div>
                </div>


            </div>
            <div id='right-content' className='w-[30%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <span className='font-semibold text-lg'>Active Now</span>

                <div className='flex flex-col gap-2'>
                    <span className='font-semibold text-center text-sm'>It's quite for now...</span>
                    <span className='text-sm text-center text-gray-500'>When a friends is online, we'll show it here</span>
                </div>
            </div>
        </div>
    )
}

export default AddFriendContent