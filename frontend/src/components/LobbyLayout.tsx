import React, { useState } from 'react'
import CreateServerDialog from './CreateServerDialog'
import ServerList from './ServerList'
import { Outlet } from 'react-router'

const LobbyLayout = () => {
    const [createServerDialogOpen, setCreateServerDialogOpen] = useState(false)
    return (
        <div id='container' className='max-h-screen flex bg-slate-200 overflow-hidden'>
            <div id='server-list' className='w-20 h-screen bg-slate-200 flex justify-center pt-10'>
                <ServerList onAddServerClicked={() => setCreateServerDialogOpen(true)} />
            </div>
            <div id='main' className='w-full pt-10'>
                <Outlet />
            </div>
            <CreateServerDialog isOpened={createServerDialogOpen} closeDialog={() => setCreateServerDialogOpen(false)} />
        </div>
    )
}

export default LobbyLayout