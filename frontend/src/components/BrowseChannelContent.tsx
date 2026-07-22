import React, { useState } from 'react'
import ButtonPrimary from './ButtonPrimary'
import Input from './Input'
import CreateChannelDialog from './CreateChannelDialog'
import type { ChannelModel } from '../models/channelModel'

interface BrowseChannelContentProps {
    channels: ChannelModel[]
}
const BrowseChannelContent = ({ channels }: BrowseChannelContentProps) => {
    const [createChannelDialogOpened, setCreateChannelDialogOpened] = useState(false)
    return (
        <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
            <div id='content-nav' className='w-full flex items-center gap-5'>
                <div className='w-11/12'>
                    <Input label='' onInputChanged={() => console.log("")} onEnterButtonPressed={() => console.log("")} />
                </div>
                <div className='w-[17%]'>
                    <ButtonPrimary text='Create' onClick={() => setCreateChannelDialogOpened(true)} />
                </div>
            </div>

            <div id='sub-content-container' className='flex w-full h-full mt-5'>
                <div id='channel-list-table' className='border border-slate-300 w-full rounded-lg h-fit'>

                    {channels !== null ? (channels as any[]).map((item, index) => (
                        <div className='w-full flex justify-between items-center p-5 border-b border-slate-300' key={index}>
                            <span>{item.ChannelName}</span>
                            <input type='checkbox' />
                        </div>
                    )) : <span>No channels available</span>}
                </div>
            </div>

            <CreateChannelDialog isOpened={createChannelDialogOpened} closeDialog={() => setCreateChannelDialogOpened(false)} />
        </div>
    )
}

export default BrowseChannelContent