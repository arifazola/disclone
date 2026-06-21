import React, { useEffect, useRef, useState } from 'react'
import type { WebsocketResponseModel } from '../models/websocketResponseModel'
import type { IceCandidateModel } from '../models/IceCandidateModel'

interface ChannelContentProps {
    channelID: string
}
const ChannelContent = ({ channelID }: ChannelContentProps) => {
    const wsRef = useRef<WebSocket | null>(null)
    const peerConnectionRecord = useRef<Map<string, RTCPeerConnection>>(new Map())
    // const peerConnection = useRef<RTCPeerConnection | null>(null)
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

        const ws = new WebSocket(`ws://localhost:8080/ws/${channelID}/${userid}`)

        ws.onopen = (event) => {
            console.log("websocket connected")
            ws.onmessage = async (event) => {
                console.log("init", event.data)
                const data = JSON.parse(event.data) as WebsocketResponseModel

                if (data.Type == "should_call") {
                    data.Participants.forEach((participant) => {
                        makeCall(participant)
                    })
                }

                if (data.Type === "offer") {
                    console.log("offer received")
                    acceptOffer(data)
                }

                if (data.Type === "answer") {
                    console.log("setting answer rtc session description")
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
            // makeCall()
        }

        wsRef.current = ws

    }, [])

    const createPeerConnectionObject = () => {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.onicecandidate = (event) => {
            wsRef.current?.send(JSON.stringify({
                userid: userid,
                type: "ice_candidate",
                ice_candidate_data: event.candidate
            }))
        }

        peerConnection.onconnectionstatechange = (event) => {
            console.log(`peer connection state change`, peerConnection.connectionState)
        }

        peerConnection.ontrack = (event) => {
            console.log(`receiving video streams`, event.streams)
            const [remoteStream] = event.streams
            videoRef.current!.srcObject = remoteStream
        }
        return peerConnection
    }

    const makeCall = async (peerPartner: string) => {
        const peerConnection = createPeerConnectionObject()
        videoRef.current!.srcObject = localStream.current
        localStream.current?.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream.current!)
        })
        peerConnection.createDataChannel("chat");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        if (offer === undefined) {
            return
        }
        // const remoteDesc = new RTCSessionDescription(offer)
        // await peerConnection.current?.setRemoteDescription(remoteDesc)
        console.log("sending offer")
        wsRef.current?.send(JSON.stringify({
            userid: userid,
            type: "offer",
            data: offer,
            offerFor: peerPartner
        }))

        peerConnectionRecord.current.set(peerPartner, peerConnection)

        console.log("local desc", peerConnection.localDescription);
        console.log("ice gathering state", peerConnection.iceGatheringState);
    }

    const acceptOffer = async (data: WebsocketResponseModel) => {
        role.current = "callee"
        console.log("accepting offer", data.Type)
        const descriptionInit = {
            sdp: data.SDP,
            type: data.Type
        } as RTCSessionDescriptionInit
        const peerConnection = createPeerConnectionObject()
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
        console.log("offer accepted")
        console.log("local desc", peerConnection.localDescription);
        console.log("ice gathering state", peerConnection.iceGatheringState);
    }
    return (
        <video id='remoteVideo' ref={videoRef} autoPlay={true}></video>
    )
}

export default ChannelContent