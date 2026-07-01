import React, { useState } from 'react'
import { BsPersonRaisedHand } from 'react-icons/bs'
import ButtonPrimary from './ButtonPrimary'
import type { data } from 'react-router'
import AddFriendContent from './AddFriendContent'
import FriendlistContent from './FriendlistContent'
import { useQuery } from '@tanstack/react-query'
import { BASE_URL } from '../consts/const'
import { apiGet } from '../handlers/apiHandler'
import type { FriendModel } from '../models/friendModel'
import type { ResponseModel } from '../models/responseModel'

const FriendsContent = () => {
    const [activeSection, setActiveSection] = useState("add")

    const { data, error, isFetched } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const fetchFriendsRequest = await apiGet(`${BASE_URL}/friends/received`)

            const res = await fetchFriendsRequest.json() as ResponseModel<FriendModel[]>

            return res
        },
        staleTime: 1000 * 60 * 1
    })

    const renderFriendContent = () => {
        if (data === undefined) {
            return
        }

        if ((data.Data.length == 0 || data.Data.length == 0) && activeSection == "add") {
            return <AddFriendContent />
        } else {
            return <FriendlistContent friends={data.Data} friendRequest={data.Data} />
        }
    }

    return (
        <div id='content' className='w-3/4 h-dvh bg-slate-100 flex flex-col'>
            <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
                <div id='content-nav' className='w-full flex items-center'>
                    <div id='nav-list' className='flex gap-5 grow'>
                        <div className='h-10 py-1 px-3 rounded-lg text-lg flex items-center'>
                            <BsPersonRaisedHand />
                            <span>Friends</span>
                        </div>
                        <div className={`h-10 py-1 px-3 rounded-lg text-md flex items-center ${activeSection == "pending" && "bg-slate-200"} hover:cursor-pointer`} onClick={() => setActiveSection("pending")}>
                            Pending
                        </div>
                        <div className='w-32'>
                            <ButtonPrimary text='Add Friend' onClick={() => setActiveSection("add")} />
                        </div>
                    </div>
                </div>

                {renderFriendContent()}
            </div>
        </div>
    )
}

export default FriendsContent
