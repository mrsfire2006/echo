'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from "react";

import { useSignalR } from "../signalR-provider/signalR-provider";
import { MessagesStatusResponse, SingleConversationMessage } from "@/features/chat/types";

interface MessageContextValue {
    subscribeToMessage: (
        callback: (message: SingleConversationMessage) => void
    ) => () => void;


    subscribeToMessageStatus: (callback: ({ messageIds, status,conversationId }: MessagesStatusResponse) => void) => () => void
}

export const MessageContext =
    createContext<MessageContextValue | undefined>(undefined);

export default function MessageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { connection } = useSignalR();

    const subscribersMessagesRef = useRef(
        new Set<(message: SingleConversationMessage) => void>()
    );

    const subscribersMessagesStatusRef = useRef(
        new Set<({ messageIds, status,conversationId }: MessagesStatusResponse) => void>()
    );


    useEffect(() => {
        if (!connection) return;

        const handleMessage = (
            message: SingleConversationMessage
        ) => {

            subscribersMessagesRef.current.forEach(callback => {
                callback(message);
            });
        };

        const handleMessageStatus = ({ messageIds, status, conversationId }: MessagesStatusResponse) => {
            subscribersMessagesStatusRef.current.forEach(callback => {
                callback({ messageIds, status, conversationId });
            });
        }

        connection.on(
            "ReceivePrivateMessage",
            handleMessage
        );
        connection.on("ReceiveMessagesStatus",
            handleMessageStatus
        )

        return () => {
            connection.off(
                "ReceivePrivateMessage",
                handleMessage
            );
            connection.off(
                "ReceiveMessagesStatus",
                handleMessageStatus
            );
        };
    }, [connection]);

    const subscribeToMessage = useCallback(
        (callback: (message: SingleConversationMessage) => void) => {
            subscribersMessagesRef.current.add(callback);


            return () => {
                subscribersMessagesRef.current.delete(callback);
            };
        },
        []
    );
    const subscribeToMessageStatus = useCallback(
        (callback: ({ messageIds, status,conversationId }: MessagesStatusResponse) => void) => {
            subscribersMessagesStatusRef.current.add(callback);


            return () => {
                subscribersMessagesStatusRef.current.delete(callback);
            };
        },
        []
    );

    return (
        <MessageContext.Provider
            value={{
                subscribeToMessage,
                subscribeToMessageStatus
            }}
        >
            {children}
        </MessageContext.Provider>
    );
}