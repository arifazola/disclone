import React from 'react'
import { useNavigate } from 'react-router'

const Page2 = () => {
    const navigate = useNavigate()
    const onTextClicked = () => {
        navigate("/1")
    }
    return (
        <div onClick={onTextClicked}>Go to page 1</div>
    )
}

export default Page2