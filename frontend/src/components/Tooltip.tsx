import React from 'react'

interface TooltipProps {
    text: string,
    className?: string
}
const Tooltip = ({ text, className }: TooltipProps) => {
    return (
        <div className={`tooltip ${className}`}>
            {text}
        </div>
    )
}

export default Tooltip