import React, { createContext, useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { BASE_URL } from "../consts/const";
import { useQueryClient } from "@tanstack/react-query";
import { useLoading } from "../components/Loading";

interface NotificationContextType {
    setNotificationMessage: React.Dispatch<React.SetStateAction<string>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface ContextProps {
    children: React.ReactNode
}
const Notification = ({ children }: ContextProps) => {
    const [notificationMessage, setNotificationMessage] = useState("")
    const userid = window.localStorage.getItem("userid")
    const queryClient = useQueryClient()
    const { setShowLoading } = useLoading()

    useEffect(() => {
        const eventSource = new EventSource(`${BASE_URL}/stream/${userid}`)
        eventSource.onmessage = (event) => {
            setNotificationMessage(event.data)
        }

        eventSource.onerror = (error) => {
            console.log("ERROR SSE", error)
        }
    }, [])

    useEffect(() => {
        if (notificationMessage === "") {
            return
        }

        setShowLoading(false)

        queryClient.invalidateQueries({
            queryKey: ["friends"]
        })

        const timerID = setTimeout(() => {
            setNotificationMessage("")
        }, 5000)

        return () => clearTimeout(timerID)
    }, [notificationMessage])
    return (
        <NotificationContext.Provider value={{ setNotificationMessage }}>
            {notificationMessage !== "" && (
                <div className="fixed bottom-3 right-3 pl-3 pr-2 py-3 rounded-lg bg-slate-400 text-white flex items-center justify-between gap-10">
                    <div className="flex flex-col justify-center">
                        <span className="font-bold">New Friend!</span>
                        <span>{notificationMessage} just accepted your friend request</span>
                    </div>
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