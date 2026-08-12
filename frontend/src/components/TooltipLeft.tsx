
interface TooltipProps {
    text: string,
    className?: string
}
const TooltipLeft = ({ text, className }: TooltipProps) => {
    return (
        <div className={`tooltip-left ${className}`}>
            {text}
        </div>
    )
}

export default TooltipLeft