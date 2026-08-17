'use client'
import { useContext } from "react";
import { PresenceContext } from "../components/providers/signalR-events/presence-provider";
import { useSignalR } from "../components/providers/signalR-provider/signalR-provider";

interface PresenceProps {
    userId?: string;
}

export const usePresence = ({ userId }: PresenceProps = {}) => {
    const context = useContext(PresenceContext);
    const { connection } = useSignalR();


    if (!context) {
        throw new Error(
            "usePresence must be used inside PresenceProvider"
        );
    }

    const { onlineUsers } = context;

    const isOnline =
        !!userId && onlineUsers.includes(userId);

    const getOnlineUsers = async (usersIds: string[]) => {
        if (!connection) {
            throw new Error("SignalR connection is not available");
        }

        return await connection.invoke<string[]>(
            "GetOnlineUsersAsync",
            usersIds
        );
    };

    return {
        isOnline,
        onlineUsers,
        getOnlineUsers

    };
};