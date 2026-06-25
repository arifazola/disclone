import React from 'react'
import { useNavigate } from 'react-router'

interface TextLinkProps {
  text: string,
  url: string
}
const TextLink = ({ text, url }: TextLinkProps) => {
  const navigate = useNavigate()
  return (
    <a onClick={() => navigate(url)} className='text-sky-700 hover:cursor-pointer'>{text}</a>
  )
}

export default TextLink