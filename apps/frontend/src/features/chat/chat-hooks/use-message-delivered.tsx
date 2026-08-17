'use client'

import { useEffect } from "react";
import { useSignalR } from "../components/providers/signalR-provider/signalR-provider";

export default function useMessageDelivered() {
    const { connection, isConnected } = useSignalR();

    useEffect(() => {
        if (!connection || !isConnected) {
            return;
        }
        const confirmUndeliveredMessages = async () => {
            try {
                const messageIds = await connection.invoke(
                    "GetMessageIdsByStatus",
                    "Sent",
                    null
                );
                if (!messageIds.length) return;

                await connection.invoke(
                    "ConfirmMessagesByStatus",
                    messageIds,
                    "Delivered",
                    null

                );
            } catch (error) {
                console.error(
                    "Failed to confirm messages delivery:",
                    error
                );
            }
        };
        confirmUndeliveredMessages();


    }, [connection, isConnected]);
}