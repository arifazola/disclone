import React, { useEffect, useState } from 'react'
import { useNavigate, type data } from 'react-router'
import AddServerIcon from './AddServerIcon'
import DirectMessageIcon from './DirectMessageIcon'
import ServerIcon from './ServerIcon'
import { useQueryClient, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { apiGet } from '../handlers/apiHandler'
import { BASE_URL } from '../consts/const'

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
        console.log("error", error)
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
                    <ServerIcon path={item.Picture.String} />
                </div>
            )) : false}

            {[...Array(20)].map((item, index) => (
                <div className='w-full h-12 shrink-0' key={index} onClick={() => onServerClicked("")}>
                    <ServerIcon path="/fdsf" />
                </div>
            ))}

            <div className='w-full h-12 shrink-0'>
                <AddServerIcon onAddServerClicked={onAddServerClicked} />
            </div>
        </div>
    )
}

export default ServerList