import { createContext, useContext, useEffect, useRef } from "react";
import type { ContextProps } from "./NotificationContext";
import type { UserModel } from "../models/userModel";


interface UserContextType {
    userRef: React.RefObject<UserModel | null>
}
const UserContext = createContext<UserContextType | undefined>(undefined)


const User = ({ children }: ContextProps) => {
    const userRef = useRef<UserModel | null>(null)
    useEffect(() => {
        const user = window.localStorage.getItem("user")
        if (user === null) {
            return
        }

        const parsedUser = JSON.parse(user) as UserModel

        userRef.current = parsedUser
    }, [])
    return (
        <UserContext.Provider value={{ userRef }}>
            {children}
        </UserContext.Provider>
    )
}

export default User

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};