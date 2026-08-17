'use client'

import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useSignalR } from "../signalR-provider/signalR-provider";

interface PresenceContextValue {
    onlineUsers: string[],

}

export const PresenceContext = createContext<PresenceContextValue | undefined>(undefined);



export default function PresenceProvider({ children }: { children: React.ReactNode }) {

    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { connection } = useSignalR();

    useEffect(() => {
        if (!connection) return;


        const handleUserOnline = (userId: string) => {
            setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
        };
        const handleUserOffline = (userId: string) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        };

        const handleInitialOnlineUsers = (userIds: string[]) => {
            setOnlineUsers(userIds);
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
        <PresenceContext.Provider value={{ onlineUsers }} >
            {children}
        </PresenceContext.Provider>
    )
}
