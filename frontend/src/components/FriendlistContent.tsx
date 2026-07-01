import React from 'react'
import type { FriendModel } from '../models/friendModel'
import { FriendStatus } from '../enums/friendStatusEnum'
import { IoIosClose } from "react-icons/io";
import { IoIosCheckmark } from "react-icons/io";
import Tooltip from './Tooltip';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost, type ApiPostParam } from '../handlers/apiHandler';
import { BASE_URL } from '../consts/const';
import { useLoading } from './Loading';
import RightContent from './RightContent';

interface FriedlistProps {
    friends: FriendModel[]
    friendRequest: FriendModel[]
}

const FriendlistContent = ({ friends, friendRequest }: FriedlistProps) => {
    const queryClient = useQueryClient()
    const { setShowLoading } = useLoading()
    const { mutate, data, error, isError } = useMutation({
        mutationKey: ["accept_friend_request"],
        mutationFn: apiPost,
        onError: (err) => {
            console.log("error accepting friend request", err)
        },
        onSuccess(data, variables, onMutateResult, context) {
            setShowLoading(false)
            queryClient.invalidateQueries({
                queryKey: ["friends"]
            })
        },
    })

    const acceptFriendRequest = (friendID: string, action: string) => {
        const formData = new FormData()
        formData.append("friend", friendID)
        formData.append("action", action)
        const apiParam: ApiPostParam = {
            url: `${BASE_URL}/friends/update`,
            formData: formData
        }

        mutate(apiParam)
    }
    return (
        <div id='sub-content-container' className='flex w-full h-full mt-5'>
            <div id='left-content' className='w-[70%] h-full border-r border-t border-slate-300 flex flex-col p-3 gap-5'>
                <div className='w-full h-12 bg-slate-200 rounded-lg flex items-center p-2'>
                    <span className='text-slate-500 text-lg'>Search</span>
                </div>

                <span className='text-sm font-normal text-gray-600'>Received - {friendRequest.filter(i => i.Status === FriendStatus.PENDING).length}</span>

                {friendRequest.filter(i => i.Status === FriendStatus.PENDING).map((item, index) => (
                    <div className='flex items-center justify-between gap-5 p-3 border-t border-slate-200 transition-all hover:cursor-pointer hover:bg-slate-200 hover:rounded-lg' key={index}>
                        <div className='flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                                <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                            </div>
                            <span className='text-lg'>{item.Username}</span>
                        </div>
                        <div className='flex gap-3'>

                            <div className='relative group'>
                                <Tooltip text='Accept' className='absolute -top-10 right-[-55%] hidden group-has-hover:inline-block' />
                                <IoIosCheckmark className='text-3xl text-slate-400 hover:text-green-700' onClick={() => acceptFriendRequest(item.UserID, "accept")} />
                            </div>
                            <div className='relative group'>
                                <Tooltip text='Reject' className='absolute -top-10 right-[-55%] hidden group-has-hover:inline-block' />
                                <IoIosClose className='text-3xl text-slate-400 hover:text-red-700' onClick={() => acceptFriendRequest(item.UserID, "reject")} />
                            </div>

                        </div>
                    </div>
                ))}

                <span className='text-sm font-normal text-gray-600'>Sent - {friends.filter(i => i.Status === FriendStatus.PENDING).length}</span>

                {friends.filter(i => i.Status === FriendStatus.PENDING).map((item, index) => (
                    <div className='flex items-center justify-between gap-5 p-3 border-t border-slate-200 transition-all hover:cursor-pointer hover:bg-slate-200 hover:rounded-lg' key={index}>
                        <div className='flex items-center gap-5'>
                            <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500 relative'>
                                <div className='w-5 h-5 rounded-full bg-green-500 absolute top-7 right-0 border-3 border-white'></div>
                            </div>
                            <span className='text-lg'>{item.Username}</span>
                        </div>
                        <div className='relative group'>
                            <Tooltip text='Cancel' className='absolute -top-10 right-[-55%] hidden group-has-hover:inline-block' />
                            <IoIosClose className='text-3xl text-slate-400 hover:text-red-700' onClick={() => acceptFriendRequest(item.UserID, "reject")} />
                        </div>
                    </div>
                ))}

            </div>
            <RightContent />
        </div>
    )
}

export default FriendlistContent