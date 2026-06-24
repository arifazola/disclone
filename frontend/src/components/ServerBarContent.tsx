import React, { useEffect } from 'react'
import ButtonPrimary from './ButtonPrimary'
import { useNavigate, useParams } from 'react-router'
import BrowseChannelContent from './BrowseChannelContent'
import { useQuery } from '@tanstack/react-query'
import ChannelContent from './ChannelContent'

const ServerBarContent = () => {
    const { channel, server } = useParams()
    const navigate = useNavigate()

    console.log("server id", server)
    const { data, error, isFetched, isError } = useQuery({
        queryKey: ['channels'],
        queryFn: async () => {
            const fetchChannel = await fetch(`https://192.168.1.4:8080/servers/${server}/channels`, {
                credentials: "include"
            })

            if (!fetchChannel.ok) {
                throw new Error(fetchChannel.status.toString())
            }

            const result = await fetchChannel.json()

            return result
        }
    })

    const renderContent = () => {
        if (channel === "browser") return <BrowseChannelContent channels={data.channels} />
        if (channel !== "browser") return <ChannelContent channelID={channel!!} />
    }

    const onChannelClicked = (channelID: string) => {
        navigate(`/server/${server}/${channelID}`)
    }

    useEffect(() => {
        console.log("error", error)
        if (isError && error && error.message === "401") {
            console.error(error);
            navigate('/login');
        }
    }, [isError, error, navigate])

    return (
        <div className='rounded-lg border border-slate-300 flex'>
            <div id='channel-list' className='w-1/4 h-dvh flex justify-center py-5'>
                <div className='w-11/12 h-full flex flex-col items-center gap-5'>
                    <div className='w-full mt-7 flex flex-col'>
                        <div
                            onClick={() => onChannelClicked("browser")}
                            className={`w-full h-10 flex items-center rounded-lg px-5 ${channel === "browser" ? "bg-slate-300 text-slate-900" : "text-slate-500"} hover:cursor-pointer hover:bg-slate-300`}>
                            <span className='font-semibold'>Browser Channel</span>
                        </div>
                        <div className={`w-full h-10 flex items-center rounded-lg px-5 ${channel === "members" ? "bg-slate-300 text-slate-900" : "text-slate-500"} hover:cursor-pointer hover:bg-slate-300`}>
                            <span className='font-semibold'>Members</span>
                        </div>
                    </div>

                    <div className='w-full border-t border-slate-300'></div>

                    <div className='w-full flex flex-col'>
                        {!isError && isFetched && data.channels !== null ? (data.channels as any[]).map((item, index) => (
                            <div
                                className={`w-full h-10 flex items-center rounded-lg px-5 ${channel === item.ID ? "bg-slate-300 text-slate-900" : "text-slate-500"} hover:cursor-pointer hover:bg-slate-300`}
                                key={index}
                                onClick={() => onChannelClicked(item.ID)}>
                                <span className='font-semibold'>{item.ChannelName}</span>
                            </div>
                        )) : false}
                    </div>
                </div>
            </div>
            <div id='content' className='w-3/4 h-dvh bg-slate-100 flex flex-col'>
                {isFetched ? renderContent() : false}

            </div>
        </div>
    )
}

export default ServerBarContent