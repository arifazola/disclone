import React, { createContext, useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { BASE_URL } from "../consts/const";

interface NotificationContextType {
    setToastMessage: React.Dispatch<React.SetStateAction<string>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface ContextProps {
    children: React.ReactNode
}
const Notification = ({ children }: ContextProps) => {
    const [toastMessage, setToastMessage] = useState("")
    const eventSource = new EventSource(`${BASE_URL}/stream`)

    eventSource.onmessage = (event) => {
        console.log("event message", event.data)
    }

    eventSource.onerror = (error) => {
        console.log("ERROR SSE", error)
    }

    eventSource.onopen = (event) => {
        console.log("SSE OPENED")
    }
    return (
        <NotificationContext.Provider value={{ setToastMessage }}>
            {toastMessage !== "" && (
                <div className="fixed top-0 left-[40%] pl-3 pr-2 py-3 rounded-lg bg-red-700 text-white font-bold flex items-center justify-between gap-10">
                    <div className="flex justify-center">{toastMessage}</div>
                    <IoIosClose className="text-xl mt-1 hover:cursor-pointer" onClick={() => setToastMessage("")} />
                </div>
            )}
            {children}
        </NotificationContext.Provider>
    )
}

export default Notification

export const useToast = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};