import React, { useEffect } from 'react'

interface ChannelContentProps {
    channelID: string
}
const ChannelContent = ({channelID}: ChannelContentProps) => {
    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/ws/${channelID}`)

        ws.onopen = (event) => {
            console.log("websocket connected")

            ws.send("Hello, server")
        }

        ws.onmessage = (messageEvent) => {
            console.log("message event", messageEvent.data)
        }
    }, [])
  return (
    <div>ChannelContent</div>
  )
}

export default ChannelContent