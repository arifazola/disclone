import React, { createContext, useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";

interface ToastContextType {
    setToastMessage: React.Dispatch<React.SetStateAction<string>>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProps {
    children: React.ReactNode
}
const Toast = ({ children }: ToastProps) => {
    const [toastMessage, setToastMessage] = useState("kfds")
    return (
        <ToastContext.Provider value={{ setToastMessage }}>
            {toastMessage !== "" && (
                <div className="fixed top-0 left-[50%] pl-3 pr-2 py-3 rounded-lg bg-red-700 text-white font-bold flex items-center justify-between gap-10">
                    <div className="flex justify-center">{toastMessage}</div>
                    <IoIosClose className="text-xl mt-1 hover:cursor-pointer" onClick={() => setToastMessage("")} />
                </div>
            )}
            {children}
        </ToastContext.Provider>
    )
}

export default Toast

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};