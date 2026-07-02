import React, { useRef } from 'react'

interface ButtonPrimaryProp {
  text: string,
  isLoading?: boolean,
  onClick: () => void
}
const ButtonPrimary = ({ text, isLoading = false, onClick }: ButtonPrimaryProp) => {
  return (
    <button
      className='h-10 py-1 px-3 bg-primary rounded-lg text-white text-lg w-full hover:cursor-pointer'
      onClick={onClick}
      disabled={isLoading}
    >
      <div className='flex gap-1 h-full w-full justify-center items-center'>
        {isLoading && <img src='/spinner.svg' className='animate-spin h-8/12'></img>}
        <span className=''>{isLoading ? "Processing" : text}</span>
      </div>
    </button>
  )
}

export default ButtonPrimary