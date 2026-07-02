import React, { useRef } from 'react'

interface InputProps {
  label: string,
  type?: string,
  onInputChanged: (text: string) => void
  onEnterButtonPressed: () => void
}
const Input = ({ label, type = "text", onInputChanged, onEnterButtonPressed }: InputProps) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("enter pressed")
      event.preventDefault()
      onEnterButtonPressed()
    }
  }

  return (
    <div id='input' className='w-full flex flex-col gap-2'>
      <label className='text-lg font-semibold'>{label}</label>
      <div className='w-full h-12 border border-slate-600 rounded-lg px-3 has-focus:border-blue-500'>
        <input type={type} className='w-full h-full border-0 outline-0' onChange={(e) => onInputChanged(e.target.value)} onKeyDown={handleKeyDown}></input>
      </div>
    </div>
  )
}

export default Input