import React, { useState } from 'react'
import { useNavigate, type data } from 'react-router'
import AddServerIcon from './AddServerIcon'
import DirectMessageIcon from './DirectMessageIcon'
import ServerIcon from './ServerIcon'
import { useQueryClient, useQuery } from '@tanstack/react-query'

interface ServerListProps {
    onAddServerClicked: () => void
}

const ServerList = ({onAddServerClicked}: ServerListProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { data, isPending, error, isFetched } = useQuery({
        queryKey: ['servers'],
        queryFn: async () => {
            const response = await fetch("http://localhost:8080/servers", {
                method: "GET",
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error(response.status.toString())
            }

            return await response.json()
        }
    })

    if (error?.message === "401") {
        navigate("/login")
    }

    const onServerClicked = (serverName: string) => {
        navigate(`/server/${serverName}/browser`)
    }
    return (
        <div className='w-12 h-full flex flex-col gap-5'>
            <div className='w-full h-12'>
                <DirectMessageIcon />
            </div>

            <div className='w-10/12 h-1 border-t border-slate-300' />

            {isFetched && data.servers !== null ? (data.servers as any[]).map((item, index) => (
                <div className='w-full h-12' key={index} onClick={() => onServerClicked(item.ID.String)}>
                    <ServerIcon path={item.Picture.String} />
                </div>
            )) : false}

            <div className='w-full h-12'>
                <AddServerIcon onAddServerClicked={onAddServerClicked} />
            </div>
        </div>
    )
}

export default ServerList