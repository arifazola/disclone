import ButtonPrimary from './ButtonPrimary'
import Button from './Button'
import { IoIosAdd } from "react-icons/io";
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../handlers/apiHandler';
import type { ResponseModel } from '../models/responseModel';
import type { FriendModel } from '../models/friendModel';
import AddFriendContent from './AddFriendContent';
import FriendlistContent from './FriendlistContent';
import { BASE_URL } from '../consts/const';
import { useState } from 'react';
import { BsPersonRaisedHand } from "react-icons/bs";
import { useNavigate } from 'react-router';

interface DirectMessageBarContentProps {
    children: React.ReactNode
}

const DirectMessageBarContent = ({ children }: DirectMessageBarContentProps) => {
    const navigate = useNavigate()
    const { data, error, isFetched } = useQuery({
        queryKey: ["friendsfgfs"],
        queryFn: async () => {

            const fetchFriends = await apiGet(`${BASE_URL}/friends`)

            const res = await fetchFriends.json() as ResponseModel<FriendModel[]>

            return res
        },
        staleTime: 1000 * 60 * 1
    })

    const onFriendClicked = (username: string) => {
        navigate(`/friend/${username}`)
    }

    return (
        <div className='rounded-lg border border-slate-300 flex'>
            <div id='channel-list' className='w-1/4 h-screen flex justify-center py-5'>
                <div className='w-11/12 flex flex-col items-center overflow-y-auto scrollbar-none pb-5'>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        {/* <span className='font-semibold'>Find or start a conversation</span> */}
                        <Button text='Find or start a conversation' btnClass='border border-slate-300 bg-gray-200 text-sm font-semibold' onClick={() => console.log("")} />
                    </div>

                    <div className='w-full mt-7 flex flex-col gap-3'>
                        <div className='w-full h-10 bg-slate-300 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-slate-300'>
                            <span className='font-semibold'>Friends</span>
                        </div>
                        <div className='w-full h-10 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-slate-300'>
                            <span className='font-semibold'>Message Request</span>
                        </div>
                    </div>

                    <div className='w-full mt-7 flex flex-col gap-3'>
                        <div className='w-full flex justify-between items-center'>
                            <span className='font-semibold text-sm text-gray-500'>Direct Messages</span>
                            <IoIosAdd className='text-2xl text-gray-500' />
                        </div>
                        {isFetched && data?.Data !== undefined && data!.Data.filter(i => i.Status == 1).map((item) => (
                            <div className='w-full py-2 px-2 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-slate-300' onClick={() => onFriendClicked(item.Username)}>
                                <div className='w-full h-full flex items-center gap-5'>
                                    <div id='profile-picture' className='w-8 h-8 rounded-full bg-blue-500'>

                                    </div>
                                    <span className='text-lg'>{item.Username}</span>
                                </div>
                            </div>
                        ))}

                        {[...Array(20)].map((item, index) => (
                            <div className='w-full py-2 px-2 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-slate-300' onClick={() => onFriendClicked(item.Username)}>
                                <div className='w-full h-full flex items-center gap-5'>
                                    <div id='profile-picture' className='w-8 h-8 rounded-full bg-blue-500'>

                                    </div>
                                    <span className='text-lg'>{index}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}

export default DirectMessageBarContent