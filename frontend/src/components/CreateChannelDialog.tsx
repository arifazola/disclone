import React, { useState } from 'react'
import Input from './Input'
import ButtonPrimary from './ButtonPrimary'
import { useParams } from 'react-router'

interface CreateChannelDialogProps {
    isOpened: boolean
    closeDialog: () => void,
}

const CreateChannelDialog = ({isOpened, closeDialog}: CreateChannelDialogProps) => {
  const [channelName, setChannelName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {server, channel} = useParams()

  const createChannel = async () => {
    try{
      setIsLoading(true)
      const formData = new FormData()
      formData.append("serverId", server!)
      formData.append("channelName", channelName)
      const create = await fetch("http://localhost:8080/channels", {
        method: "POST",
        credentials: "include",
        body: formData
      })

      if(!create.ok){
        throw new Error("internal server error")
      }

      const res = await create.json()

      console.log("result", res)
    } catch(error: any){
      console.log("error", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div id='dialog' className={`${isOpened ? "flex" : "hidden"} absolute top-0 left-0 w-full h-full backdrop-brightness-50 backdrop-blur-xs items-center justify-center p-10`}>
        <div id='content' className='w-1/3 bg-white rounded-lg flex flex-col items-center p-10 gap-5'>
            <span className='font-bold text-2xl text-center'>Create Channel</span>
            <Input label='Channel Name' onInputChanged={setChannelName} />

            <div className='w-full flex justify-between items-center'>
            <span onClick={() => closeDialog()}>Back</span>
            <div className='w-20'>
                <ButtonPrimary text='Create' onClick={createChannel} />
            </div>
            </div>
        </div>
    </div>
  )
}

export default CreateChannelDialog