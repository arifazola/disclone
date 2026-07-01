import React from 'react'

const RightContent = () => {
    return (
        <div id='right-content' className='w-[30%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
            <span className='font-semibold text-lg'>Active Now</span>

            <div className='flex flex-col gap-2'>
                <span className='font-semibold text-center text-sm'>It's quite for now...</span>
                <span className='text-sm text-center text-gray-500'>When a friends is online, we'll show it here</span>
            </div>
        </div>
    )
}

export default RightContent