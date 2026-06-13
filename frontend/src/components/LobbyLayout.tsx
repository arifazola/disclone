import React from 'react'
import CreateServerDialog from './CreateServerDialog'
import ServerList from './ServerList'
import { Outlet } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const LobbyLayout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div id='container' className='min-h-dvh flex bg-slate-200'>
                <div id='server-list' className='w-20 h-dvh bg-slate-200 flex justify-center pt-10'>
                    <ServerList />
                </div>
                <div id='main' className='w-full pt-10'>
                    <Outlet />
                </div>
                {/* <CreateServerDialog isOpened={isDialogOpened} closeDialog={() => setIsDialogOpened(false)} /> */}
            </div>
        </QueryClientProvider>
    )
}

export default LobbyLayout