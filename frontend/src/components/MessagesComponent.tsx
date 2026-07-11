import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { apiGet } from '../handlers/apiHandler'
import { BASE_URL, BASE_WS } from '../consts/const'
import type { ResponseModel } from '../models/responseModel'
import type { MessageModel } from '../models/messageModel'
import Tooltip from './Tooltip'
import type { WebsocketChatModel } from '../models/websocketChatModel'
import { updateMessageDataQuery } from '../helpers/queryClientHelper'

interface MessagesComponentProps {
    chatID: string
    websocket: React.RefObject<WebSocket | null>
    messageContainerRef: React.RefObject<HTMLDivElement | null>
}

const MessagesComponent = ({ chatID, websocket, messageContainerRef }: MessagesComponentProps) => {
    const queryClient = useQueryClient()
    const { data, error, isFetched } = useQuery({
        queryKey: ["messages"],
        queryFn: async () => {
            const messages = await apiGet(`${BASE_URL}/chats/${chatID}/messages`)

            const res = await messages.json() as ResponseModel<MessageModel[]>

            if (!messages.ok) {
                throw new Error(res.Message)
            }

            return res
        }
    })

    useEffect(() => {
        if (websocket.current === null) {
            return
        }

        websocket.current.onmessage = (event) => {

            const parsedMessage = JSON.parse(event.data) as WebsocketChatModel

            const newMessageModel: MessageModel = {
                ID: "",
                ChatID: parsedMessage.chatid,
                Message: parsedMessage.message,
                Sender: parsedMessage.userid,
                Timestamp: 1234
            }

            updateMessageDataQuery(queryClient, newMessageModel)
        }
    }, [])

    useEffect(() => {
        if (!isFetched) {
            return
        }

        if (messageContainerRef.current !== null) {
            messageContainerRef.current.scrollTop = messageContainerRef.current?.scrollHeight
        }
    }, [isFetched])


    const renderOutgoingMessage = (message: string, messageID: string) => {
        return (
            <div className="flex justify-end" key={messageID}>
                <div className="relative max-w-md">
                    <div className="rounded-2xl rounded-tr-md bg-indigo-500 px-4 py-3 text-white">
                        {message}
                    </div>
                </div>
            </div>
        )
    }

    const renderIncomingMessage = (message: string, messageID: string) => {
        return (
            <div className="flex items-start gap-2" key={messageID}>
                <img
                    src="https://placehold.co/40"
                    className="w-10 h-10 rounded-full"
                    alt=""
                />

                <div className="relative max-w-md">
                    <div className="rounded-2xl rounded-tl-md bg-gray-200 px-4 py-3 text-gray-900">
                        {message}
                    </div>

                    <div
                        className="absolute left-0 top-4 -translate-x-2 w-0 h-0
             border-t-8 border-b-8 border-r-8
             border-t-transparent border-b-transparent border-r-gray-200">
                    </div>
                </div>
            </div>
        )
    }

    const renderMessage = (sender: string, message: string, messageID: string) => {
        const userid = window.localStorage.getItem('userid')

        if (userid === null) {
            return
        }

        if (sender === userid) {
            return renderOutgoingMessage(message, messageID)
        } else {
            return renderIncomingMessage(message, messageID)
        }
    }
    return (
        <div className='flex flex-col gap-3 pb-5'>
            {data?.Data !== null && data?.Data.map((item) => (
                renderMessage(item.Sender, item.Message, item.ID)
            ))}
        </div>
    )
}

export default MessagesComponent