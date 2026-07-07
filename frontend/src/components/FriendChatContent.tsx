import { IoSend } from "react-icons/io5";
import RightContent from './RightContent'
import RightContentChat from "./RightContentChat";
import { useParams } from "react-router";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, type ApiPostParam } from "../handlers/apiHandler";
import { BASE_URL, BASE_WS } from "../consts/const";
import type { ResponseModel } from "../models/responseModel";
import type { UserModel } from "../models/userModel";
import type { FriendModel } from "../models/friendModel";
import type { ServerModel } from "../models/serverModel";
import { useEffect, useRef, useState } from "react";
import MessagesComponent from "./MessagesComponent";
import type { WebsocketChatModel } from "../models/websocketChatModel";
import { updateMessageDataQuery } from "../helpers/queryClientHelper";
import type { MessageModel } from "../models/messageModel";

const FriendChatContent = () => {
    const { username } = useParams()
    const chatIDRef = useRef("")
    const userid = window.localStorage.getItem("userid")
    const [message, setMessage] = useState("")
    const ws = useRef<WebSocket | null>(null)
    const [isWebsocketConnected, setIsWebsocketConnected] = useState(false)
    const queryClient = useQueryClient()
    const messageContainerRef = useRef<HTMLDivElement | null>(null)

    const { data, isLoading, isFetched, error } = useQuery({
        queryKey: ["friendData"],
        queryFn: async () => {
            const [profile, mutualFriends, mutualServers, chatID] = await Promise.all(
                [
                    apiGet(`${BASE_URL}/users/${username}/profile`),
                    apiGet(`${BASE_URL}/users/${username}/mutual-friends`),
                    apiGet(`${BASE_URL}/users/${username}/mutual-servers`),
                    apiGet(`${BASE_URL}/chats/${username}/id`),
                ]
            )

            const profileData = await profile.json() as ResponseModel<UserModel>
            const mutualFriendData = await mutualFriends.json() as ResponseModel<FriendModel[]>
            const mutualServersData = await mutualServers.json() as ResponseModel<ServerModel[]>
            const chatIDData = await chatID.json() as ResponseModel<string>

            console.log("mutual servers", mutualServersData)

            chatIDRef.current = chatIDData.Data

            return { profileData, mutualFriendData, mutualServersData, chatIDData }
        }
    })

    useEffect(() => {
        if (!isFetched) {
            return
        }

        ws.current = new WebSocket(`${BASE_WS}/ws/chat/${data?.chatIDData.Data}/${username}`)

        ws.current.onopen = () => {
            console.log("websocket connected")
            setIsWebsocketConnected(true)
        }

        ws.current.onerror = (error) => {
            console.log("ws error", error)
        }

        return () => {
            ws.current?.close()
        }
    }, [isFetched])

    const handleSendMessage = () => {

        const chatModel: WebsocketChatModel = {
            chatid: data!.chatIDData.Data,
            message: message,
            userid: userid ? userid : ""
        }

        ws.current?.send(JSON.stringify(chatModel))

        const newMessageModel: MessageModel = {
            ChatID: data!.chatIDData.Data,
            ID: "",
            Message: message,
            Sender: userid ? userid : "",
            Timestamp: Math.floor(Date.now() / 1000)
        }

        updateMessageDataQuery(queryClient, newMessageModel)

        // window.scrollTo({
        //     top: messageContainerRef.current?.scrollHeight,
        //     behavior: "smooth"
        // })

        if (messageContainerRef.current !== null) {
            messageContainerRef.current.scrollTop = messageContainerRef.current?.scrollHeight
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setMessage("")
            event.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div id='content' className='w-3/4 h-[calc(100vh-40px)] bg-slate-100 flex flex-col'>
            <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
                <div id='sub-content-container' className='flex w-full h-full mt-5'>
                    <div id='left-content' className='w-[70%] h-full border-r border-slate-300 flex flex-col justify-between p-3'>
                        <div className='flex flex-col h-11/12 gap-5 overflow-y-auto scrollbar-none' ref={messageContainerRef}>
                            <div className='h-16 w-16 bg-primary rounded-full shrink-0'></div>

                            <span className='font-bold text-3xl'>{username}</span>

                            <span className='font-light'>This is the beginning of your direct message with <span className='font-semibold'>{username}</span></span>

                            <div className='flex gap-14 items-center'>
                                <div className='flex relative'>
                                    {[...Array(2)].map((item, index) => (
                                        <div className={`h-8 w-8 border-2 border-slate-100 bg-blue-500 rounded-full ${index == 1 ? "absolute left-5" : ""}`}></div>
                                    ))}

                                    {data?.mutualServersData.Data.length === 3 && (
                                        <div className="h-8 w-8 border-2 border-slate-100 bg-blue-500 rounded-full left-10"></div>
                                    )}
                                </div>
                                <span className='font-light'>{data?.mutualServersData.Data.length} Mutual Servers</span>
                            </div>

                            <div className='h-1 border-t w-full border-slate-300'></div>

                            {isFetched && isWebsocketConnected && (
                                <MessagesComponent chatID={chatIDRef.current} websocket={ws} messageContainerRef={messageContainerRef} />
                            )}

                        </div>

                        <div className='h-16 bg-slate-100 border border-slate-300 rounded-lg shadow-lg p-3 flex items-center'>
                            <input placeholder={`Message ${username}`} className='w-full h-full outline-0' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
                            <IoSend onClick={handleSendMessage} />
                        </div>
                    </div>
                    <RightContentChat
                        userData={data?.profileData.Data}
                        mutualFriends={data?.mutualFriendData.Data}
                        mutualServers={data?.mutualServersData.Data}
                    />
                </div>
            </div>
        </div>
    )
}

export default FriendChatContent