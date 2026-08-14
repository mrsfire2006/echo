'use client'
import { useEffect, useId, useState } from "react";
import { useSignalR } from "../components/providers/signalR-provider";
import { CurrentConversation, useCurrentConversation } from "../components/providers/current-conversation-provider";

export default function usePresence() {
    const { connection, isConnected } = useSignalR();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { setCurrentConversation } = useCurrentConversation();
    useEffect(() => {
        if (!connection) return;
        const handleUserOnline = (userId: string) => {

            setCurrentConversation((prevConv) => {
                if (prevConv && prevConv.otherUserId === userId) {
                    return { ...prevConv, isOnline: true };
                }
                return prevConv;
            });
            setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
        };

        const handleUserOffline = (userId: string) => {
            setCurrentConversation((prevConv) => {
                if (prevConv && prevConv.otherUserId === userId) {
                    return { ...prevConv, isOnline: false };
                }
                return prevConv;
            });
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        };
        const handleInitialOnlineUsers = (userIds: string[]) => {
            setOnlineUsers((prev) => Array.from(new Set([...prev, ...userIds])));
        };

        connection.on("UserOnline", handleUserOnline);
        connection.on("UserOffline", handleUserOffline);
        connection.on("InitialOnlineUsers", handleInitialOnlineUsers);
        return () => {
            connection.off("UserOnline");
            connection.off("UserOffline");
            connection.off(
                'InitialOnlineUsers',
                handleInitialOnlineUsers
            );
        }
    }, [connection])

    return { onlineUsers }
}