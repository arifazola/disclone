import React, { createRef, use, useEffect, useRef, useState } from 'react'
import type { WebsocketResponseModel } from '../models/websocketResponseModel'
import type { IceCandidateModel } from '../models/IceCandidateModel'
import { BASE_WS } from '../consts/const'
import type { UserModel } from '../models/userModel'

interface ChannelContentProps {
    channelID: string
    onParticipantJoined: (users: UserModel[], channelID: string) => void
}
const ChannelContent = ({ channelID, onParticipantJoined }: ChannelContentProps) => {
    const wsRef = useRef<WebSocket | null>(null)
    const peerConnectionRecord = useRef<Map<string, RTCPeerConnection>>(new Map())
    // const peerConnection = useRef<RTCPeerConnection | null>(null)
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoMap = useRef<Map<string, HTMLVideoElement>>(new Map())
    const role = useRef("caller")
    const localStream = useRef<MediaStream | null>(null)
    const [socketMsg, setSocketMsg] = useState("")
    const userid = window.localStorage.getItem("userid")
    const [participants, setParticipants] = useState<string[]>([])
    const participantRef = useRef<string[]>([])

    useEffect(() => {
        const getLocalStream = async () => {

            const constraints = {
                'video': true,
                'audio': true
            }

            localStream.current = await navigator.mediaDevices.getUserMedia(constraints)

        }

        getLocalStream()
    }, [])

    const onStart = () => {
        if (localStream.current === undefined) {
            return
        }
        const ws = new WebSocket(`${BASE_WS}/ws/call/${channelID}/${userid}`)

        ws.onopen = (event) => {
            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data) as WebsocketResponseModel
                if (data.Type == "should_call") {
                    // participants.current = data.Participants
                    const participantIDs = data.Participants.map((item) => item.ID)
                    setParticipants(participantIDs)
                    data.Participants.forEach((participant) => {
                        makeCall(participant.ID)
                    })

                    console.log("ws data", data)
                    console.log("calling on participant joined callback")
                    onParticipantJoined(data.Participants, channelID)
                }

                if (data.Type === "offer") {
                    participantRef.current.push(data.Sender)
                    setParticipants(prev => [...prev, data.Sender])
                    acceptOffer(data)
                }

                if (data.Type === "answer") {
                    const descriptionInit = {
                        sdp: data.SDP,
                        type: data.Type
                    } as RTCSessionDescriptionInit
                    const peerConnection = peerConnectionRecord.current.get(data.Sender)
                    if (peerConnection === undefined) return
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(descriptionInit))
                }

                if (data.Type == "ice_candidate") {
                    if (data.Data !== null) {
                        const iceCandidate = data.Data as IceCandidateModel
                        const candidateInit = {
                            candidate: iceCandidate.Candidate,
                            sdpMid: iceCandidate.SDPMid,
                            sdpMLineIndex: iceCandidate.SDPMLineIndex,
                            usernameFragment: iceCandidate.UserFragment
                        } as RTCLocalIceCandidateInit

                        for (const [key, value] of peerConnectionRecord.current) {
                            await value.addIceCandidate(new RTCIceCandidate(candidateInit))
                        }
                        // await peerConnection.addIceCandidate(new RTCIceCandidate(candidateInit))
                    }
                }
            }
        }

        wsRef.current = ws
    }

    const createPeerConnectionObject = (user: string) => {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.onicecandidate = (event) => {
            wsRef.current?.send(JSON.stringify({
                userid: userid,
                type: "ice_candidate",
                ice_candidate_data: event.candidate
            }))
        }

        // peerConnection.onconnectionstatechange = (event) => {
        //     console.log(`peer connection state change`, peerConnection.connectionState)
        // }

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams
            const remoteVideo = remoteVideoMap.current.get(user)
            if (remoteVideo === undefined) {
                return
            }

            remoteVideo.srcObject = remoteStream
            // remoteVideo.play()
            // remoteVideoRef.current!.srcObject = remoteStream
            // remoteVideoRef.current!.play()
        }

        localVideoRef.current!.srcObject = localStream.current
        // localVideoRef.current!.play()
        localStream.current?.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream.current!)
        })
        return peerConnection
    }

    const makeCall = async (peerPartner: string) => {
        const peerConnection = createPeerConnectionObject(peerPartner)

        peerConnection.createDataChannel("chat");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        if (offer === undefined) {
            return
        }
        // const remoteDesc = new RTCSessionDescription(offer)
        // await peerConnection.current?.setRemoteDescription(remoteDesc)
        wsRef.current?.send(JSON.stringify({
            userid: userid,
            type: "offer",
            data: offer,
            offerFor: peerPartner
        }))

        peerConnectionRecord.current.set(peerPartner, peerConnection)
    }

    const acceptOffer = async (data: WebsocketResponseModel) => {
        role.current = "callee"
        const descriptionInit = {
            sdp: data.SDP,
            type: data.Type
        } as RTCSessionDescriptionInit
        const peerConnection = createPeerConnectionObject(data.Sender)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(descriptionInit))
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        wsRef.current?.send(JSON.stringify({
            userid: userid,
            type: "answer",
            data: answer,
            sender: data.Sender
        }))

        peerConnectionRecord.current.set(data.Sender, peerConnection)
    }
    return (
        <>
            <button onClick={onStart}>Startt</button>
            <div className='flex flex-col gap-5 w-full h-full'>
                <span>This is local</span>
                <video autoPlay={true} className='w-1/2 h-full' id='localVideo' ref={localVideoRef}></video>
                <span>This is remote</span>
                {/* <video autoPlay={true} className='w-1/2 h-full' id='remoteVideo' ref={remoteVideoRef}></video> */}
                {participants.map((item) => (
                    <>
                        <span>loop</span>
                        <video autoPlay={true} className='w-1/2 h-full' key={item} id='remoteVideo' ref={el => {
                            if (el) {
                                remoteVideoMap.current.set(item, el)
                            }
                        }}></video>
                    </>
                ))}
            </div>
        </>
    )
}

export default ChannelContent