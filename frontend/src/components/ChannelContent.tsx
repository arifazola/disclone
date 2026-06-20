import React, { useEffect, useRef, useState } from 'react'
import type { WebsocketResponseModel } from '../models/websocketResponseModel'
import type { IceCandidateModel } from '../models/IceCandidateModel'

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

        ws.onopen = (event) => {
            console.log("websocket connected")
            ws.onmessage = async (event) => {
                console.log("init", event.data)
                const data = JSON.parse(event.data) as WebsocketResponseModel

                if (data.Type == "should_call") {
                    makeCall()
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
                    await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(descriptionInit))
                }

                if (data.Type == "ice_candidate") {
                    if (data.Data !== null) {
                        console.log("ice candidate data", data.Data)
                        const iceCandidate = data.Data as IceCandidateModel
                        const candidateInit = {
                            candidate: iceCandidate.Candidate,
                            sdpMid: iceCandidate.SDPMid,
                            sdpMLineIndex: iceCandidate.SDPMLineIndex,
                            usernameFragment: iceCandidate.UserFragment
                        } as RTCLocalIceCandidateInit
                        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidateInit))
                    }
                }
            }
            // makeCall()
        }

        wsRef.current = ws

        peerConnection.current.onicecandidate = (event) => {
            // console.log("ice candidate change", event.candidate)
            wsRef.current?.send(JSON.stringify({
                userid: userid,
                type: "ice_candidate",
                ice_candidate_data: event.candidate
            }))
        }

        peerConnection.current.onconnectionstatechange = (event) => {
            console.log("peer connection state change", peerConnection.current?.connectionState)
        }

        peerConnection.current.ontrack = async (event) => {
            console.log("receiving video streams", event.streams)
            const [remoteStream] = event.streams
            videoRef.current!.srcObject = remoteStream
        }

    }, [])

    const makeCall = async () => {
        videoRef.current!.srcObject = localStream.current
        localStream.current?.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, localStream.current!)
        })
        peerConnection.current?.createDataChannel("chat");
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        if (offer === undefined) {
            return
        }
        // const remoteDesc = new RTCSessionDescription(offer)
        // await peerConnection.current?.setRemoteDescription(remoteDesc)
        console.log("sending offer")
        wsRef.current?.send(JSON.stringify({
            userid: userid,
            type: "offer",
            data: offer
        }))

        console.log("local desc", peerConnection.current?.localDescription);
        console.log("ice gathering state", peerConnection.current?.iceGatheringState);
    }

    const acceptOffer = async (data: WebsocketResponseModel) => {
        role.current = "callee"
        console.log("accepting offer", data.Type)
        const descriptionInit = {
            sdp: data.SDP,
            type: data.Type
        } as RTCSessionDescriptionInit
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(descriptionInit))
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        wsRef.current?.send(JSON.stringify({
            userid: userid,
            type: "answer",
            data: answer
        }))
        console.log("offer accepted")
        console.log("local desc", peerConnection.current?.localDescription);
        console.log("ice gathering state", peerConnection.current?.iceGatheringState);
    }
    return (
        <video id='remoteVideo' ref={videoRef} autoPlay={true}></video>
    )
}

export default ChannelContent