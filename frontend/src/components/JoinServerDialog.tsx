import React, { useState } from 'react'
import Input from './Input'
import ButtonPrimary from './ButtonPrimary'

interface JoinServerDialogProps {
    closeDialog: () => void
}

const JoinServerDialog = ({ closeDialog }: JoinServerDialogProps) => {
    const [serverID, setServerID] = useState("")
    const joinServer = async () => {
        console.log("clicked")
        try {
            const join = await fetch(`http://192.168.1.11:8080/servers/${serverID}/join`, {
                method: "POST",
                credentials: "include"
            })

            if (!join.ok) {
                throw new Error("failed to join server")
            }

            const res = await join.json()

            console.log("result", res)
        } catch (error: any) {
            console.log("error join server", error)
        } finally {

        }
    }
    return (
        <div id='content' className='w-1/3 bg-white rounded-lg flex flex-col items-center p-10 gap-5'>
            <span className='font-bold text-2xl text-center'>Join a server</span>
            <Input label='Server ID' onInputChanged={setServerID} />

            <div className='w-full flex justify-between items-center'>
                <span onClick={() => closeDialog()}>Back</span>
                <div className='w-20'>
                    <ButtonPrimary text='Join' onClick={joinServer} />
                </div>
            </div>
        </div>
    )
}

export default JoinServerDialog