import React from 'react'
import { IoAddCircle } from "react-icons/io5";

interface AddServerIconProps {
    onAddServerClicked : () => void
}
const AddServerIcon = ({onAddServerClicked}: AddServerIconProps) => {
  return (
    <button className='rounded-lg bg-slate-300 w-full h-full flex items-center justify-center group hover:bg-primary hover:cursor-pointer' onClick={onAddServerClicked}>
        <IoAddCircle className='w-6/12 h-6/12 group-hover:text-white' />
    </button>
  )
}

export default AddServerIcon