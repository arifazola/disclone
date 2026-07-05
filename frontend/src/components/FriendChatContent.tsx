import { IoSend } from "react-icons/io5";
import RightContent from './RightContent'
import RightContentChat from "./RightContentChat";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../handlers/apiHandler";
import { BASE_URL } from "../consts/const";
import type { ResponseModel } from "../models/responseModel";
import type { UserModel } from "../models/userModel";
import type { FriendModel } from "../models/friendModel";

const FriendChatContent = () => {
    const { username } = useParams()

    const { data, isLoading, error } = useQuery({
        queryKey: ["friendData", "mutualFriendData"],
        queryFn: async () => {
            const [profile, mutualFriends] = await Promise.all(
                [
                    apiGet(`${BASE_URL}/users/${username}/profile`),
                    apiGet(`${BASE_URL}/users/${username}/mutual-friends`)
                ]
            )

            const profileData = await profile.json() as ResponseModel<UserModel>
            const mutualFriendData = await mutualFriends.json() as ResponseModel<FriendModel[]>

            console.log("mutual friends", mutualFriendData)

            return { profileData, mutualFriendData }
        }
    })
    return (
        <div id='content' className='w-3/4 h-[calc(100vh-40px)] bg-slate-100 flex flex-col'>
            <div id='content-container' className='w-full h-full py-5 px-7 flex flex-col'>
                <div id='sub-content-container' className='flex w-full h-full mt-5'>
                    <div id='left-content' className='w-[70%] h-full border-r border-slate-300 flex flex-col justify-between p-3'>
                        <div className='flex flex-col h-11/12 gap-5 overflow-y-auto scrollbar-none'>
                            <div className='h-16 w-16 bg-primary rounded-full shrink-0'></div>

                            <span className='font-bold text-3xl'>{username}</span>

                            <span className='font-light'>This is the beginning of your direct message with <span className='font-semibold'>{username}</span></span>

                            <div className='flex gap-14 items-center'>
                                <div className='flex relative'>
                                    <div className='h-8 w-8 border-2 border-slate-100 bg-blue-500 rounded-full'></div>
                                    <div className='h-8 w-8 border-2 border-slate-100 bg-red-500 rounded-full absolute left-5'></div>
                                    <div className='h-8 w-8 border-2 border-slate-100 bg-green-500 rounded-full absolute left-10'></div>
                                </div>
                                <span className='font-light'>3 Mutual Servers</span>
                            </div>

                            <div className='h-1 border-t w-full border-slate-300'></div>

                            {[...Array(20)].map((item, index) => (
                                <span>{index}</span>
                            ))}
                        </div>

                        <div className='h-16 bg-slate-100 border border-slate-300 rounded-lg shadow-lg p-3 flex items-center'>
                            <input placeholder={`Message ${username}`} className='w-full h-full outline-0' />
                            <IoSend />
                        </div>
                    </div>
                    <RightContentChat userData={data?.profileData.Data} mutualFriends={data?.mutualFriendData.Data} />
                </div>
            </div>
        </div>
    )
}

export default FriendChatContent