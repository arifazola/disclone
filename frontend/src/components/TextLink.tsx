import React from 'react'

interface TextLinkProps{
    text: string,
    url: string
}
const TextLink = ({text, url}: TextLinkProps) => {
  return (
    <a href={`${url}`} className='text-sky-700'>{text}</a>
  )
}

export default TextLink