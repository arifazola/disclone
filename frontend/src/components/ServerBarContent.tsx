import React from 'react'
import ButtonPrimary from './ButtonPrimary'
import { useParams } from 'react-router'
import BrowseChannelContent from './BrowseChannelContent'
import { useQuery } from '@tanstack/react-query'

const ServerBarContent = () => {
    const { channel } = useParams()

    // const {data, error} = useQuery()

    const renderContent = () => {
        if(channel === "browser") return <BrowseChannelContent />
    }
    
    return (
        <div className='rounded-lg border border-slate-300 flex'>
            <div id='channel-list' className='w-1/4 h-dvh flex justify-center py-5'>
                <div className='w-11/12 h-full flex flex-col items-center gap-5'>
                    <div className='w-full mt-7 flex flex-col'>
                        <div className='w-full h-10 bg-slate-300 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-900'>Browser Channel</span>
                        </div>
                        <div className='w-full h-10 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-500'>Members</span>
                        </div>
                    </div>

                    <div className='w-full border-t border-slate-300'></div>

                    <div className='w-full flex flex-col'>
                        <div className='w-full h-10 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-500'>Channel 1</span>
                        </div>
                        <div className='w-full h-10 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-500'>Channel 1</span>
                        </div>
                        <div className='w-full h-10 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-500'>Channel 1</span>
                        </div>
                        <div className='w-full h-10 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-500'>Channel 1</span>
                        </div>
                        <div className='w-full h-10 flex items-center rounded-lg px-5'>
                            <span className='font-semibold text-slate-500'>Channel 1</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id='content' className='w-3/4 h-dvh bg-slate-100 flex flex-col'>
                {renderContent()}
            </div>
        </div>
    )
}

export default ServerBarContent