interface ButtonProp {
    text: string,
    isLoading?: boolean,
    btnClass?: string,
    onClick : () => void
}
const Button = ({text, isLoading = false, onClick, btnClass}: ButtonProp) => {
  return (
    <button className={`${btnClass} h-10 py-1 px-3 rounded-lg text-lg w-full hover:cursor-pointer`} onClick={onClick} disabled={isLoading}>
        {isLoading ? "Processing" : text}
    </button>
  )
}

export default Button