import React from 'react'

const ChannelList = () => {
    return (
        <div id='channel-list' className='w-1/4 h-dvh flex justify-center py-5'>
            <div className='w-11/12 h-full flex flex-col items-center'>
                <div className='w-full h-10 bg-slate-300 flex items-center justify-center rounded-lg'>
                    <span className='font-semibold'>Find or start a conversation</span>
                </div>

                <div className='w-full mt-7 flex flex-col gap-3'>
                    <div className='w-full h-10 bg-slate-300 flex items-center justify-center rounded-lg'>
                        <span className='font-semibold'>Friends</span>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <span className='font-semibold'>Message Request</span>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <span className='font-semibold'>Nitro</span>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <span className='font-semibold'>Shop</span>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <span className='font-semibold'>Quests</span>
                    </div>
                </div>

                <div className='w-full mt-7 flex flex-col gap-3'>
                    <div className='w-full flex justify-between'>
                        <span>Direct Messages</span>
                        <span>➕</span>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <div className='w-full h-full flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                            </div>
                            <span className='text-lg'>Friend 1</span>
                        </div>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <div className='w-full h-full flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                            </div>
                            <span className='text-lg'>Friend 2</span>
                        </div>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <div className='w-full h-full flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                            </div>
                            <span className='text-lg'>Friend 3</span>
                        </div>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <div className='w-full h-full flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                            </div>
                            <span className='text-lg'>Friend 4</span>
                        </div>
                    </div>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        <div className='w-full h-full flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                            </div>
                            <span className='text-lg'>Friend 5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChannelList