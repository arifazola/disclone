import React, { useEffect, useState } from 'react'
import { useNavigate, type data } from 'react-router'
import AddServerIcon from './AddServerIcon'
import DirectMessageIcon from './DirectMessageIcon'
import ServerIcon from './ServerIcon'
import { useQueryClient, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { apiGet } from '../handlers/apiHandler'
import { BASE_URL } from '../consts/const'
import Tooltip from './Tooltip'
import TooltipLeft from './TooltipLeft'

interface ServerListProps {
    onAddServerClicked: () => void
}

const ServerList = ({ onAddServerClicked }: ServerListProps) => {
    const navigate = useNavigate()
    const { data, isPending, error, isFetched, isError } = useQuery({
        queryKey: ['servers'],
        queryFn: async () => {
            const response = await apiGet(`${BASE_URL}/servers`)

            return await response.json()
        }
    })

    const onServerClicked = (serverName: string) => {
        navigate(`/server/${serverName}/browser`)
    }

    useEffect(() => {
        if (isError && error && error.message === "401") {
            console.error(error);
            navigate('/login');
        }
    }, [isError, error, navigate])

    return (
        <div className='w-12 flex flex-col gap-5 overflow-y-auto scrollbar-none'>
            <div className='w-full h-12 shrink-0' onClick={() => navigate("/")}>
                <DirectMessageIcon />
            </div>

            <div className='w-10/12 h-1 border-t border-slate-300' />

            {!isError && isFetched && data.servers !== null ? (data.servers as any[]).map((item, index) => (
                <div className='w-full h-12 shrink-0' key={index} onClick={() => onServerClicked(item.ID.String)}>
                    <div className='group z-[999999999]'>
                        <TooltipLeft text={item.Name.String} className='absolute left-[5.5%] translate-y-1 hidden group-has-hover:inline-block' />
                        <ServerIcon path={item.Picture.String} />
                    </div>
                </div>
            )) : false}

            <div className='w-full h-12 shrink-0'>
                <AddServerIcon onAddServerClicked={onAddServerClicked} />
            </div>
        </div>
    )
}

export default ServerList