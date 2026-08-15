'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useSignalR } from "./signalR-provider";



const TypingContext = createContext<string[]>([]);




export default function TypingProvider({ children }: { children: React.ReactNode }) {
    const { connection } = useSignalR();
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!connection) return;
        const handleUserTyping = (userId:string) => {
            setTypingUsers((prev) => {
                const current = prev ?? [];
                return [...new Set([...current, userId])];
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


    return (<TypingContext.Provider value={typingUsers}>{children}</TypingContext.Provider>)

}



export const useTypingUsers = () => {
    const context = useContext(TypingContext);

    return context;
}