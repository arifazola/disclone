import React, { useEffect, useRef, useState } from 'react'

interface ChannelContentProps {
    channelID: string
}
const ChannelContent = ({ channelID }: ChannelContentProps) => {
    const wsRef = useRef<WebSocket | null>(null)
    const peerConnection = useRef<RTCPeerConnection | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const role = useRef("caller")
    const localStream = useRef<MediaStream | null>(null)
    const [socketMsg, setSocketMsg] = useState("")
    const userid = window.localStorage.getItem("userid")
    useEffect(() => {
        const getLocalStream = async () => {
            const constraints = {
                'video': true,
                'audio': true
            }

            localStream.current = await navigator.mediaDevices.getUserMedia(constraints)
        }

        getLocalStream()

        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        peerConnection.current = new RTCPeerConnection(configuration);

        const ws = new WebSocket(`ws://localhost:8080/ws/${channelID}/${userid}`)

        ws.onopen = async (event) => {
            ws.onmessage = (event) => {
                console.log("init", event.data)
            }
            makeCall()
        }

        wsRef.current = ws

    }, [])

    const makeCall = async () => {
        videoRef.current!.srcObject = localStream.current
        localStream.current?.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, localStream.current!)
        })
        peerConnection.current?.createDataChannel("chat");
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        console.log("sending offer")
        wsRef.current?.send(JSON.stringify({
            userid: userid,
            type: "offer",
            data: offer
        }))
    }

    const acceptOffer = async () => {
        role.current = "callee"
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        wsRef.current?.send(JSON.stringify({
            type: "answer",
            data: answer
        }))
    }
    return (
        <video ref={videoRef} />
    )
}

export default ChannelContent