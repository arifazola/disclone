import { useState } from 'react'
import Input from './Input'
import ButtonPrimary from './ButtonPrimary'
import { BASE_URL } from '../consts/const'
import { useToast } from '../contexts/ToastContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost, type ApiPostParam } from '../handlers/apiHandler'

interface JoinServerDialogProps {
    closeDialog: () => void
}

const JoinServerDialog = ({ closeDialog }: JoinServerDialogProps) => {
    const [serverID, setServerID] = useState("")
    const { setToastMessage } = useToast()
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationKey: ['joinServer'],
        mutationFn: apiPost,
        onError: () => {
            setToastMessage("Failed to join server")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servers'] })
            closeDialog()
        }
    })

    const handleJoinServer = () => {
        const formData = new FormData()
        const apiPostParam: ApiPostParam = {
            formData: formData,
            url: `${BASE_URL}/servers/${serverID}/join`
        }
        mutate(apiPostParam)
    }

    return (
        <div id='content' className='w-1/3 bg-white rounded-lg flex flex-col items-center p-10 gap-5'>
            <span className='font-bold text-2xl text-center'>Join a server</span>
            <Input label='Server ID' onInputChanged={setServerID} onEnterButtonPressed={() => ""} />

            <div className='w-full flex justify-between items-center'>
                <span onClick={() => closeDialog()}>Back</span>
                <div className='w-20'>
                    <ButtonPrimary text='Join' onClick={handleJoinServer} isLoading={isPending} />
                </div>
            </div>
        </div>
    )
}

export default JoinServerDialog