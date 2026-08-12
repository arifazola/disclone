import { useRef } from 'react'

interface ServerIconProps {
  path: string
}
const ServerIcon = ({ path }: ServerIconProps) => {
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageError = () => {
    if (imgRef.current === null) {
      return
    }
    imgRef.current.src = "/logo.png"
  }
  return (
    <div className='rounded-lg bg-primary w-full h-full flex items-center justify-center'>
      <img src={`${import.meta.env.VITE_S3_BUCKET_URL}${path}`} className='w-full h-full rounded-lg' ref={imgRef} onError={onImageError} />
    </div>
  )
}

export default ServerIcon