import { IoIosArrowForward } from "react-icons/io";
import type { UserModel } from "../models/userModel";
import { unixSecondTimeStampToDate } from "../helpers/timeHelper";
import type { FriendModel } from "../models/friendModel";

interface RightContentChatProps {
    userData: UserModel | undefined
    mutualFriends: FriendModel[] | undefined
}

const RightContentChat = ({ userData, mutualFriends }: RightContentChatProps) => {
    const renderMutualFriend = () => {
        if (mutualFriends === undefined) {
            return
        }

        return (
            <span className='font-semibold text-sm'>Mutual Friends &mdash; {mutualFriends.length}</span>
        )
    }
    return (
        <div id='right-content' className='w-[30%] h-full border-r border-t border-slate-300 flex flex-col justify-between gap-5'>
            <div className='flex flex-col gap-5 p-3'>
                <div className='h-16 w-16 bg-primary rounded-full shrink-0'></div>
                <span className='font-bold text-xl'>{userData?.Username}</span>

                <div className='flex flex-col gap-2 border border-slate-300 p-3 rounded-lg'>
                    <span className='font-bold text-xs'>Member since</span>
                    <span className='text-sm'>{unixSecondTimeStampToDate(userData?.JoinedDate).toLocaleDateString()}</span>
                </div>

                <div className='flex flex-col gap-3 border border-slate-300 p-3 rounded-lg'>
                    <div className="flex justify-between items-center">
                        <span className='font-semibold text-sm'>Mutual Servers &mdash; 9</span>
                        <IoIosArrowForward />
                    </div>

                    <div className="h-1 border-t border-slate-300"></div>

                    <div className="flex justify-between items-center">
                        {renderMutualFriend()}
                        <IoIosArrowForward />
                    </div>
                </div>
            </div>

            <div className="h-10 border-t bg-slate-100 border-slate-300 font-light flex justify-center items-center hover:cursor-pointer hover:brightness-95">
                <span>View Full Profile</span>
            </div>
        </div>
    )
}

export default RightContentChat