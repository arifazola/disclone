import { useNavigate, useParams } from 'react-router'
import BrowseChannelContent from './BrowseChannelContent'
import { useQuery } from '@tanstack/react-query'
import ChannelContent from './ChannelContent'
import { apiGet, apiPost, type ApiPostParam } from '../handlers/apiHandler'
import { BASE_URL } from '../consts/const'
import { useEffect, useState } from 'react'
import type { UserModel } from '../models/userModel'
import { useUser } from '../contexts/UserContext'
import type { ChannelModel } from '../models/channelModel'
import type { ResponseModel } from '../models/responseModel'
import type { Participants } from '../models/channelParticipantModel'
import { useToast } from '../contexts/NotificationContext'
import type { NotificationParticipantJoinedModel } from '../models/notificationParticipantJoinedModel'

const ServerBarContent = () => {
    const { channel, server } = useParams()
    const navigate = useNavigate()
    const [participants, setParticipants] = useState<Participants | null>(null)
    const { userRef } = useUser()
    const { notification, setNotification } = useToast()
    const [channelComponentKey, setChannelComponentKey] = useState(0)

    const { data, error, isFetched, isError } = useQuery({
        queryKey: [server],
        queryFn: async () => {
            const channels = await apiGet(`${BASE_URL}/servers/${server}/channels`)
            const res = await channels.json() as ResponseModel<ChannelModel[]>

            const channelIDs = res.Data.map((item) => item.ID)

            const formData = new FormData()
            formData.append("channelIDs", JSON.stringify(channelIDs))
            const param: ApiPostParam = {
                url: `${BASE_URL}/channel-participants`,
                formData: formData
            }
            const channelParticipants = await apiPost(param) as ResponseModel<Participants>

            console.log("participants", channelParticipants.Data.Participants)

            setParticipants(channelParticipants.Data)

            return { res, channelParticipants }
        },

    })

    const renderContent = () => {
        if (channel === "browser") return <BrowseChannelContent channels={data!.res.Data} />
        if (channel !== "browser") return <ChannelContent onParticipantJoined={onParticipantJoined} key={channelComponentKey} />
    }

    const onChannelClicked = (channelID: string) => {
        removeParticipant(channel!, userRef.current!.ID)

        if (channelID !== "browser") {
            setChannelComponentKey(prev => prev + 1)
        }

        navigate(`/server/${server}/${channelID}`)
    }

    const onParticipantJoined = (users: UserModel[], channelID: string) => {
        // setParticipants((prev) => {
        //     const newMap = new Map(prev)
        //     const users = newMap.get(channelID)
        //     if (users === undefined) {
        //         console.log("on participant joined users undefined", users)
        //         const newUsers: UserModel[] = [userRef.current!]
        //         newMap.set(channelID, newUsers)
        //     } else {
        //         console.log("on participant joined users", users)
        //         users?.push(userRef.current!)
        //     }

        //     return newMap
        // })
    }

    useEffect(() => {
        const data = notification?.Data as NotificationParticipantJoinedModel
        console.log("data notif", data)

        if (data === undefined) {
            return
        }

        if (notification?.Message === "user_joined") {
            appendParticipant(data)
        }

        if (notification?.Message === "user_left") {
            removeParticipant(data.ChannelID, data.User.ID)
        }


    }, [notification])

    const appendParticipant = (data: NotificationParticipantJoinedModel) => {
        setParticipants(prev => {

            const participantRecord: Record<string, UserModel[]> = {}
            const participantsModel: Participants = {
                Participants: participantRecord
            }

            if (prev === null) {
                return participantsModel
            }

            if (Object.keys(prev.Participants).length === 0) {
                console.log("empty participant obj")
                participantRecord[data.ChannelID] = [data.User]
                participantsModel.Participants = participantRecord
                return participantsModel
            }

            const existingParticipant = prev.Participants[data.ChannelID]

            existingParticipant.push(data.User)

            participantRecord[data.ChannelID] = existingParticipant

            participantsModel.Participants = participantRecord
            console.log("updated participants", participantsModel)
            return participantsModel
        })
    }

    const removeParticipant = (channelID: string, userID: string) => {
        setParticipants(prev => {
            const participantRecord: Record<string, UserModel[]> = {}
            const participantsModel: Participants = {
                Participants: participantRecord
            }

            if (prev === null) {
                return prev
            }

            const existingParticipant = prev.Participants[channelID]

            if (existingParticipant === undefined) {
                return participantsModel
            }
            const newArr = existingParticipant.filter(item => item.ID !== userID)

            participantRecord[channelID] = newArr

            participantsModel.Participants = participantRecord

            return participantsModel
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
                        {!isError && isFetched && data !== undefined ? data?.res.Data.map((item, index) => (
                            <div className='flex flex-col'>
                                <div
                                    className={`w-full min-h-10 flex flex-col justify-center rounded-lg px-5 ${channel === item.ID ? "bg-slate-300 text-slate-900" : "text-slate-500"} hover:cursor-pointer hover:bg-slate-300`}
                                    key={index}
                                    onClick={() => onChannelClicked(item.ID)}>
                                    <span className='font-semibold'>{item.ChannelName}</span>
                                </div>
                                <div className='flex flex-col px-5'>
                                    {Object.keys(participants!.Participants).length > 0 && participants?.Participants[item.ID] !== undefined ? participants?.Participants[item.ID].map((userItem) => (
                                        <span>{userItem.Username}</span>
                                    )) : false}
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