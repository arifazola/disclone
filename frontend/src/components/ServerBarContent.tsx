import { useNavigate, useParams } from 'react-router'
import BrowseChannelContent from './BrowseChannelContent'
import { useQuery } from '@tanstack/react-query'
import ChannelContent from './ChannelContent'
import { apiGet, apiPost, type ApiPostParam } from '../handlers/apiHandler'
import { BASE_URL } from '../consts/const'
import { useEffect, useState, type ReactNode } from 'react'
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
    const [leftUser, setLeftUser] = useState("")

    const { data, error, isFetched, isError } = useQuery({
        queryKey: [server],
        queryFn: async () => {
            const channels = await apiGet(`${BASE_URL}/servers/${server}/channels`)
            const res = await channels.json() as ResponseModel<ChannelModel[]>
            if (res.Data === null) {
                return res
            }
            const channelIDs = res.Data.map((item) => item.ID)

            const formData = new FormData()
            formData.append("channelIDs", JSON.stringify(channelIDs))
            const param: ApiPostParam = {
                url: `${BASE_URL}/channel-participants`,
                formData: formData
            }
            const channelParticipants = await apiPost(param) as ResponseModel<Participants>

            setParticipants(channelParticipants.Data)

            return res
        },

    })

    const renderContent = () => {
        if (data === undefined) {
            return
        }

        if (data.Data === null) {
            return
        }

        if (channel === "browser") return <BrowseChannelContent channels={data.Data} />
        if (channel !== "browser") return <ChannelContent userLeftChannel={leftUser} onUserLeftCompleted={onUserLeftCompleted} />
    }

    const onChannelClicked = (channelID: string) => {
        if (channelID === "browser") {
            removeParticipant(channel!, userRef.current!.ID)
        }

        navigate(`/server/${server}/${channelID}`)
    }

    const renderChannelList = () => {
        if (data === undefined) {
            return (<div id='no'></div>)
        }

        if (data.Data === null) {
            return (<div id='no'></div>)
        }

        if (!isError && isFetched && data !== undefined && data.Data !== null) {
            const els = data.Data.map((item, index) => (
                <div className='flex flex-col mam'>
                    <div
                        className={`w-full min-h-10 flex flex-col justify-center rounded-lg px-5 ${channel === item.ID ? "bg-slate-300 text-slate-900" : "text-slate-500"} hover:cursor-pointer hover:bg-slate-300`}
                        key={index}
                        onClick={() => onChannelClicked(item.ID)}>
                        <span className='font-semibold'>{item.ChannelName}</span>
                    </div>

                    {renderListOfParticipants(item)}
                </div>
            ))
            return els
        }
        return []
    }


    const renderListOfParticipants = (item: ChannelModel) => {
        if (participants === null) {
            return
        }

        console.log("render list of participant")

        return (<div className='flex flex-col px-5'>
            {Object.keys(participants!.Participants).length > 0 && participants?.Participants[item.ID] !== undefined ? participants?.Participants[item.ID].map((userItem) => (
                <span>{userItem.Username}</span>
            )) : false}
        </div>)
    }

    useEffect(() => {
        const eventSource = new EventSource(`${BASE_URL}/stream/channel/${userRef.current?.ID}`)
        eventSource.onmessage = (event) => {
            console.log("receiving message from channel stream", event.data)
            const data = JSON.parse(event.data) as ResponseModel<NotificationParticipantJoinedModel>
            if (data === undefined) {
                return
            }

            if (data.Data === null) {
                return
            }

            if (data.Message === "user_joined") {
                appendParticipant(data.Data)
            }

            if (data.Message === "user_left") {
                console.log("removing user")
                removeParticipant(data.Data.ChannelID, data.Data.User.ID)
                setLeftUser(data.Data.User.ID)
            }
        }

        eventSource.onerror = (error) => {
            console.log("ERROR SSE", error)
        }
    }, [])

    const appendParticipant = (data: NotificationParticipantJoinedModel) => {
        setParticipants(prev => {

            const participantRecord: Record<string, UserModel[]> = {}
            const participantsModel: Participants = {
                Participants: participantRecord
            }

            if (prev === null) {
                return participantsModel
            }

            const copiedParticipantsModel = structuredClone(prev)

            // participantsModel = copiedMap

            if (Object.keys(prev.Participants).length === 0) {
                participantRecord[data.ChannelID] = [data.User]
                participantsModel.Participants = participantRecord
                return participantsModel
            }

            const existingParticipant = prev.Participants[data.ChannelID]

            if (existingParticipant === undefined) {
                copiedParticipantsModel.Participants[data.ChannelID] = [data.User]
                return copiedParticipantsModel
            }

            existingParticipant.push(data.User)

            participantRecord[data.ChannelID] = existingParticipant

            participantsModel.Participants = participantRecord
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

            prev.Participants[channelID] = newArr

            const participants: Participants = {
                Participants: prev.Participants
            }

            return participants
        })
    }

    const onUserLeftCompleted = () => {
        setLeftUser("")
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
                        {renderChannelList()}
                    </div>
                </div>
            </div>
            <div id='content' className='w-3/4 h-dvh bg-slate-100 flex flex-col relative'>
                {isFetched ? renderContent() : false}
            </div>
        </div>
    )
}

export default ServerBarContent