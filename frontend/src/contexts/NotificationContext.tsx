import React, { createContext, useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { BASE_URL } from "../consts/const";
import { useQueryClient } from "@tanstack/react-query";
import { useLoading } from "../components/Loading";
import type { ResponseModel } from "../models/responseModel";

interface NotificationContextType {
    setNotification: React.Dispatch<React.SetStateAction<ResponseModel<string> | null>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export interface ContextProps {
    children: React.ReactNode
}
const Notification = ({ children }: ContextProps) => {
    const [notification, setNotification] = useState<ResponseModel<string> | null>(null)
    const userid = window.localStorage.getItem("userid")
    const queryClient = useQueryClient()
    const { setShowLoading } = useLoading()

    useEffect(() => {
        const eventSource = new EventSource(`${BASE_URL}/stream/${userid}`)
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data) as ResponseModel<string>
            console.log("notification data", data)
            setNotification(data)
        }

        eventSource.onerror = (error) => {
            console.log("ERROR SSE", error)
        }
    }, [])

    useEffect(() => {
        if (notification === null) {
            return
        }

        setShowLoading(false)

        queryClient.invalidateQueries({
            queryKey: ["friends"]
        })

        const timerID = setTimeout(() => {
            setNotification(null)
        }, 5000)

        return () => clearTimeout(timerID)
    }, [notification])
    return (
        <NotificationContext.Provider value={{ setNotification }}>
            {notification !== null && (
                <div className="fixed bottom-3 right-3 pl-3 pr-2 py-3 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-between gap-10">
                    <div className="flex flex-col justify-center">
                        <span className="font-bold">{notification.Message}</span>
                        <span>{notification.Data}</span>
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