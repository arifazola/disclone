import React from 'react'
import { Outlet } from 'react-router'

const TestLayout = () => {
    return (
        <div className='w-full h-dvh bg-red-500'>
            <Outlet />
        </div>
    )
}

export default TestLayout