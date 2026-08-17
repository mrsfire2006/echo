'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useSignalR } from "../signalR-provider/signalR-provider";

interface TypingContextValue {
    typingUsers: string[]
}

export const TypingContext = createContext<TypingContextValue | undefined>(undefined);

export default function TypingProvider({ children }: { children: React.ReactNode }) {
    const { connection } = useSignalR();
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!connection) return;

        const handleUserTyping = (userId: string) => {
            setTypingUsers((prev) => {
                return prev.includes(userId) ? prev : [...prev, userId]
            })
        }
        const handleUserStopTyping = (userId: string) => {
            setTypingUsers((prev) =>
                prev.filter((id) => id !== userId)
            );
        }

        connection.on("UserTyping", handleUserTyping);
        connection.on("UserStoppedTyping", handleUserStopTyping);


        return () => {
            connection.off("UserTyping", handleUserTyping)
            connection.off("UserStoppedTyping", handleUserStopTyping)
        }
    }, [connection])


    return (<TypingContext.Provider value={{ typingUsers }}>{children}</TypingContext.Provider>)

}



