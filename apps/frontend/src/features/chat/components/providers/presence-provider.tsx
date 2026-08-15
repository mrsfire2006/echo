'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSignalR } from "./signalR-provider";

interface PresenceValue {
    onlineUsers: string[]
}

const PresenceContext = createContext<PresenceValue>({ onlineUsers: [] });


export function PresenceContextProvider({ children }: { children: React.ReactNode }) {
    const { connection } = useSignalR();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!connection) return;
        const handleUserOnline = (userId: string) => {
            setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
        };
        const handleUserOffline = (userId: string) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        };
        const handleInitialOnlineUsers = (userIds: string[]) => {
            setOnlineUsers((prev) => Array.from(new Set([...prev, ...userIds])));
        };


        connection.on("UserOnline", handleUserOnline);
        connection.on("UserOffline", handleUserOffline);
        connection.on("InitialOnlineUsers", handleInitialOnlineUsers);
        return () => {
            connection.off("UserOnline", handleUserOnline);
            connection.off("UserOffline", handleUserOffline);
            connection.off(
                'InitialOnlineUsers',
                handleInitialOnlineUsers
            );
        }
    }, [connection])

    return (
        <PresenceContext.Provider value={{ onlineUsers }}>{children}</PresenceContext.Provider>
    )
}


export default function usePresence() {
    const context = useContext(PresenceContext);
    return context;

}