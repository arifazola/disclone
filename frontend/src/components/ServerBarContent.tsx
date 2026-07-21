import { useNavigate, useParams } from 'react-router'
import BrowseChannelContent from './BrowseChannelContent'
import { useQuery } from '@tanstack/react-query'
import ChannelContent from './ChannelContent'
import { apiGet } from '../handlers/apiHandler'
import { BASE_URL } from '../consts/const'
import { useState } from 'react'
import type { UserModel } from '../models/userModel'
import { useUser } from '../contexts/UserContext'

const ServerBarContent = () => {
    const { channel, server } = useParams()
    const navigate = useNavigate()
    const [participants, setParticipants] = useState<Map<string, UserModel[]>>(new Map())
    const { userRef } = useUser()

    const { data, error, isFetched, isError } = useQuery({
        queryKey: [server],
        queryFn: async () => {
            const channels = await apiGet(`${BASE_URL}/servers/${server}/channels`)
            return await channels.json()
        },

    })

    const renderContent = () => {
        if (channel === "browser") return <BrowseChannelContent channels={data.channels} />
        if (channel !== "browser") return <ChannelContent channelID={channel!!} onParticipantJoined={onParticipantJoined} />
    }

    const onChannelClicked = (channelID: string) => {
        if (userRef.current === null) {
            return
        }
        setParticipants((prev) => {
            const newMap = new Map(prev)
            const users = newMap.get(channelID)
            if (users === undefined) {
                console.log("on channel clicked users undefined", users)
                const newUsers: UserModel[] = [userRef.current!]
                newMap.set(channelID, newUsers)
            } else {
                console.log("on channel clicked users", users)
                users?.push(userRef.current!)
            }

            return newMap
        })
        navigate(`/server/${server}/${channelID}`)
    }

    const onParticipantJoined = (users: UserModel[], channelID: string) => {
        setParticipants((prev) => {
            const newMap = new Map(prev)
            const users = newMap.get(channelID)
            if (users === undefined) {
                console.log("on participant joined users undefined", users)
                const newUsers: UserModel[] = [userRef.current!]
                newMap.set(channelID, newUsers)
            } else {
                console.log("on participant joined users", users)
                users?.push(userRef.current!)
            }

            return newMap
        })
    }

    return (
        <div className='rounded-lg border border-slate-300 flex'>
            <div id='channel-list' className='w-1/4 h-screen flex justify-center py-5'>
                <div className='w-11/12 h-full flex flex-col items-center gap-5 overflow-y-auto scrollbar-none pb-5'>
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
                                className={`w-full min-h-10 flex flex-col justify-center rounded-lg px-5 ${channel === item.ID ? "bg-slate-300 text-slate-900" : "text-slate-500"} hover:cursor-pointer hover:bg-slate-300`}
                                key={index}
                                onClick={() => onChannelClicked(item.ID)}>
                                <span className='font-semibold'>{item.ChannelName}</span>
                                <div className='flex flex-col'>
                                    {participants?.get(item.ID)?.map((userItem) => (
                                        <span>{userItem.Username}</span>
                                    ))}
                                </div>
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