import React from 'react'
import { Outlet } from 'react-router'

const TestLayout = () => {
    console.log("layout loaded")
    return (
        <div className='w-full h-dvh bg-red-500'>
            <Outlet />
        </div>
    )
}

export default TestLayout