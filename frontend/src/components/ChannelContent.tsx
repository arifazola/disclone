import React, { createRef, use, useEffect, useRef, useState } from 'react'
import type { WebsocketResponseModel } from '../models/websocketResponseModel'
import type { IceCandidateModel } from '../models/IceCandidateModel'
import { BASE_WS } from '../consts/const'
import type { UserModel } from '../models/userModel'
import { useUser } from '../contexts/UserContext'
import { useParams } from 'react-router'
import { IoMic } from "react-icons/io5";
import { IoMicOff } from "react-icons/io5";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";


interface ChannelContentProps {
    onParticipantJoined: (users: UserModel[], channelID: string) => void
    userLeftChannel: string
    onUserLeftCompleted: () => void
}
const ChannelContent = ({ onParticipantJoined, userLeftChannel, onUserLeftCompleted }: ChannelContentProps) => {
    const { channel, server } = useParams()
    const wsRef = useRef<WebSocket | null>(null)
    const peerConnectionRecord = useRef<Map<string, RTCPeerConnection>>(new Map())
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoMap = useRef<Map<string, HTMLVideoElement>>(new Map())
    const role = useRef("caller")
    const localStream = useRef<MediaStream | null>(null)
    const [participants, setParticipants] = useState<string[]>([])
    const participantRef = useRef<string[]>([])
    const { userRef } = useUser()
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)

    useEffect(function setupVideoCall() {
        const getLocalStream = async () => {

            const constraints = {
                'video': true,
                'audio': true
            }

            localStream.current = await navigator.mediaDevices.getUserMedia(constraints)

        }

        const setup = async () => {
            await getLocalStream()
            onStart()
        }

        setup()

        console.log("setup is run")

        return () => {
            localStream.current?.getTracks().forEach(track => track.stop())
            wsRef.current?.close()
        }
    }, [channel])

    useEffect(function removeVideoParticipant() {
        console.log("participant left")

        if (userLeftChannel === "") {
            return
        }

        setParticipants(prev => {
            return prev.filter(i => i !== userLeftChannel)
        })

        onUserLeftCompleted()
    }, [userLeftChannel])

    const onStart = () => {
        if (localStream.current === undefined) {
            return
        }
        const ws = new WebSocket(`${BASE_WS}/ws/call/${server}/${channel}/${userRef.current?.ID}/${userRef.current?.Username}`)

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
                    onParticipantJoined(data.Participants, channel!)
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
                userid: userRef.current?.ID,
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
            userid: userRef.current?.ID,
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
            userid: userRef.current?.ID,
            type: "answer",
            data: answer,
            sender: data.Sender
        }))

        peerConnectionRecord.current.set(data.Sender, peerConnection)
    }

    const muteMic = () => {
        const audioTrack = localStream.current?.getAudioTracks()[0]

        if (audioTrack !== undefined) {
            setIsMuted(!isMuted)
            console.log("muting")
            audioTrack.enabled = !isMuted
        }

    }

    const turnOffCamera = () => {
        const videoTrack = localStream.current?.getVideoTracks()[0]

        if (videoTrack !== undefined) {
            setIsVideoOff(!isVideoOff)
            console.log("muting")
            videoTrack.enabled = isVideoOff
        }
    }

    return (
        <>
            <div className='grid grid-cols-4 gap-5 w-full h-full'>
                <video autoPlay={true} className='rounded-lg' id='localVideo' ref={localVideoRef}></video>
                {/* <video autoPlay={true} className='w-1/2 h-full' id='remoteVideo' ref={remoteVideoRef}></video> */}
                {participants.map((item) => (
                    <>
                        <video autoPlay={true} className='rounded-lg' key={item} id='remoteVideo' ref={el => {
                            if (el) {
                                remoteVideoMap.current.set(item, el)
                            }
                        }}></video>
                    </>
                ))}
            </div>

            <div className='absolute bottom-12 w-full flex justify-center'>
                <div className='p-5 border border-slate-300 rounded-lg flex justify-center items-center gap-10'>
                    {isMuted ? (
                        <IoMic className='text-xl hover:cursor-pointer' onClick={muteMic} />
                    ) : (
                        <IoMicOff className='text-xl hover:cursor-pointer' onClick={muteMic} />
                    )}

                    {isVideoOff ? (
                        <BsFillCameraVideoFill className='text-xl hover:cursor-pointer' onClick={turnOffCamera} />
                    ) : (
                        <BsFillCameraVideoOffFill className='text-xl hover:cursor-pointer' onClick={turnOffCamera} />
                    )}
                </div>
            </div>
        </>
    )
}

export default ChannelContent