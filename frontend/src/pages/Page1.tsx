import React from 'react'
import { useNavigate } from 'react-router'

const Page1 = () => {
    const navigate = useNavigate()
    const onTextClicked = () => {
        navigate("/2")
    }
    return (
        <div onClick={onTextClicked}>Go to page 2</div>
    )
}

export default Page1