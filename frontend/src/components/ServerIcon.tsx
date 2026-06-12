import React from 'react'

interface ServerIconProps {
  path: string
}
const ServerIcon = ({path}: ServerIconProps) => {
  return (
    <div className='rounded-lg bg-primary w-full h-full flex items-center justify-center'>
        <img src={`${import.meta.env.VITE_S3_BUCKET_URL}${path}`} className='w-full h-full rounded-lg'/>
    </div>
  )
}

export default ServerIcon