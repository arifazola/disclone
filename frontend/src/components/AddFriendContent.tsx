import React, { useState } from 'react'
import ButtonPrimary from './ButtonPrimary'
import Button from './Button'
import { BASE_URL } from '../consts/const'
import { useMutation } from '@tanstack/react-query'
import { apiPost, type ApiPostParam } from '../handlers/apiHandler'
import { useToast } from '../contexts/ToastContext'
import type { ResponseModel } from '../models/responseModel'

const AddFriendContent = () => {
    const { setToastMessage } = useToast()
    const [username, setUsername] = useState("")
    const { mutate, isPending, error, isError, data } = useMutation({
        mutationFn: apiPost,
        onError: (err) => {
            console.log("error fetch", err)
            const parseData = JSON.parse(err.message) as ResponseModel<any>
            setToastMessage(parseData.Message)
        },
        onSuccess: (data) => {

        }
    })

    const sendFriendRequest = () => {
        const formData = new FormData()
        formData.append("username", username)
        const postParam: ApiPostParam = {
            formData: formData,
            url: `${BASE_URL}/friends`
        }
        mutate(postParam)
    }
    return (
        <div id='sub-content-container' className='flex w-full h-full mt-5'>
            <div id='left-content' className='w-[70%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-xl'>Add Friend</span>
                    <span>You can add friends with their username</span>
                </div>

                <div className='w-full h-12 bg-slate-200 rounded-lg flex items-center p-2'>
                    <input type='text' className='h-full w-[90%] outline-0' placeholder='Enter a username' onChange={(e) => setUsername(e.target.value)}></input>
                    <div className='w-[35%]'>
                        <Button text='Send Friend Request' onClick={sendFriendRequest} btnClass='bg-primary text-white text-sm' />
                    </div>
                </div>


            </div>
            <div id='right-content' className='w-[30%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <span className='font-semibold text-lg'>Active Now</span>

                <div className='flex flex-col gap-2'>
                    <span className='font-semibold text-center text-sm'>It's quite for now...</span>
                    <span className='text-sm text-center text-gray-500'>When a friends is online, we'll show it here</span>
                </div>
            </div>
        </div>
    )
}

export default AddFriendContent