import { useIsFetching } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

interface LoadingContextType {
    setShowLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProps {
    children: React.ReactNode
}

const Loading = ({ children }: LoadingProps) => {
    const isFetching = useIsFetching()
    const [showLoading, setShowLoading] = useState(true)

    return (
        <LoadingContext.Provider value={{ setShowLoading }}>
            {isFetching > 0 && showLoading && (
                <div className='w-full h-full absolute top-0 z-[10000] bg-slate-200 flex flex-col items-center justify-center'>
                    <img src='/main-icon.svg' className='w-10 h-10 animate-bounce'></img>
                    <span className='font-semibold text-slate-400'>Getting you ready</span>
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    )
}

export default Loading

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};