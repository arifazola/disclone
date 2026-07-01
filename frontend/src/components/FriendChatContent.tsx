import React from 'react'
import { BsPersonRaisedHand } from 'react-icons/bs'
import Button from './Button'
import ButtonPrimary from './ButtonPrimary'
import RightContent from './RightContent'

const FriendChatContent = () => {
    return (
        <div id='content' className='w-3/4 h-dvh bg-slate-100 flex flex-col'>
            <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
                <div id='sub-content-container' className='flex w-full h-full mt-5'>
                    <div id='left-content' className='w-[70%] h-full border-r border-slate-300 flex flex-col p-3 gap-5'>
                        {/* <div className='flex flex-col gap-1'>
                            <span className='font-semibold text-xl'>Add Friend</span>
                            <span>You can add friends with their username</span>
                        </div> */}

                        <div className='h-16 w-16 bg-primary rounded-full'></div>

                        <span className='font-bold text-3xl'>Username</span>

                        <span className='font-light'>This is the beginning of your direct message with <span className='font-semibold'>Username</span></span>

                        <div className='flex gap-14 items-center'>
                            <div className='flex relative'>
                                <div className='h-8 w-8 border-2 border-slate-100 bg-blue-500 rounded-full'></div>
                                <div className='h-8 w-8 border-2 border-slate-100 bg-red-500 rounded-full absolute left-5'></div>
                                <div className='h-8 w-8 border-2 border-slate-100 bg-green-500 rounded-full absolute left-10'></div>
                            </div>
                            <span className='font-light'>3 Mutual Servers</span>
                        </div>

                        <div className='h-1 border-t w-full border-slate-300'></div>

                        <div className='w-80 h-10 bg-slate-300 fixed bottom-0'></div>
                    </div>
                    <RightContent />
                </div>
            </div>
        </div>
    )
}

export default FriendChatContent