import React from 'react'

interface ButtonPrimaryProp {
    text: string,
    isLoading?: boolean,
    onClick : () => void
}
const ButtonPrimary = ({text, isLoading = false, onClick}: ButtonPrimaryProp) => {
  return (
    <button className='h-10 py-1 px-3 bg-blue-500 rounded-lg text-white text-lg w-full hover:cursor-pointer' onClick={onClick} disabled={isLoading}>
        {isLoading ? "Processing" : text}
    </button>
  )
}

export default ButtonPrimary