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

const DirectMessageBarContent = () => {
    const [activeSection, setActiveSection] = useState("add")
    const { data, error, isFetched } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const [friends, friendRequest] = await Promise.all(
                [
                    apiGet(`${BASE_URL}/friends`),
                    apiGet(`${BASE_URL}/friends/received`)
                ]
            )

            const friendsData = await friends.json() as ResponseModel<FriendModel[]>
            const friendRequestData = await friendRequest.json() as ResponseModel<FriendModel[]>

            return { friendsData, friendRequestData }
        },
        staleTime: 1000 * 60 * 1
    })

    console.log("data", data?.friendsData.Data)
    console.log("error", error)

    const renderFriendContent = () => {
        if (data === undefined) {
            return
        }

        console.log("is data 0", (data.friendsData.Data.length == 0 || data.friendRequestData.Data.length == 0))
        console.log("is sectionadd", activeSection == "add")

        if ((data.friendsData.Data.length == 0 || data.friendRequestData.Data.length == 0) && activeSection == "add") {
            return <AddFriendContent />
        } else {
            return <FriendlistContent friends={data.friendsData.Data} friendRequest={data.friendRequestData.Data} />
        }
    }
    return (
        <div className='rounded-lg border border-slate-300 flex'>
            <div id='channel-list' className='w-1/4 h-dvh flex justify-center py-5'>
                <div className='w-11/12 h-full flex flex-col items-center'>
                    <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                        {/* <span className='font-semibold'>Find or start a conversation</span> */}
                        <Button text='Find or start a conversation' btnClass='border border-slate-300 bg-gray-200 text-sm font-semibold' onClick={() => console.log("")} />
                    </div>

                    <div className='w-full mt-7 flex flex-col gap-3'>
                        <div className='w-full h-10 bg-slate-300 flex items-center justify-center rounded-lg'>
                            <span className='font-semibold'>Friends</span>
                        </div>
                        <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                            <span className='font-semibold'>Message Request</span>
                        </div>
                    </div>

                    <div className='w-full mt-7 flex flex-col gap-3'>
                        <div className='w-full flex justify-between items-center'>
                            <span className='font-semibold text-sm text-gray-500'>Direct Messages</span>
                            <IoIosAdd className='text-2xl text-gray-500' />
                        </div>
                        {isFetched && data?.friendsData.Data !== undefined && data!.friendsData.Data.filter(i => i.Status == 1).map((item) => (
                            <div className='w-full h-10 flex items-center justify-center rounded-lg'>
                                <div className='w-full h-full flex items-center gap-5'>
                                    <div id='profile-picture' className='w-10 h-10 rounded-full bg-blue-500'>

                                    </div>
                                    <span className='text-lg'>{item.Username}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
        </div>
    )
}

export default DirectMessageBarContent