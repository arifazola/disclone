import { useIsFetching } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

interface LoadingProps {
    children: React.ReactNode
}

const Loading = () => {
    const isFetching = useIsFetching()

    return isFetching > 0 && (
        <div className='w-full h-full absolute top-0 z-[10000] bg-slate-200 flex flex-col items-center justify-center'>
            <img src='/main-icon.svg' className='w-10 h-10 animate-bounce'></img>
            <span className='font-semibold text-slate-400'>Getting you ready</span>
        </div>
    )
}

export default Loading