
import { useCallback, useContext, useEffect } from "react";
import { MessageContext } from "../components/providers/signalR-events/message-provider";
import { useSignalR } from "../components/providers/signalR-provider/signalR-provider";
import { validate } from "uuid";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ConversationMessagesResponse, MessagesStatusResponse, SingleConversationMessage } from "../types";
import { ChatKeys } from "../chat-keys";
import { playMessageSound } from "@/lib/sound";
import { useGetUserProfile } from "@/features/user/hooks";



interface MessageRequestProps {
    receiverId: string,
    content: string,
    conversationId: string

}

export const useMessage = ({ conversationId }: { conversationId?: string }) => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error(
            "useMessage must be used inside MessageProvider"
        );
    }
    const { subscribeToMessage, subscribeToMessageStatus } = context;
    const { connection, isConnected } = useSignalR();
    const queryClient = useQueryClient();

    const { data: user } = useGetUserProfile();
    const currentUserId = user?.value?.id
    const sendMessage = useCallback(
        async (request: MessageRequestProps) => {
            if (
                !connection ||
                !request.conversationId ||
                !request.content.trim() ||
                !validate(request.receiverId)
            ) {
                return;
            }

            await connection.invoke(
                "SendPrivateMessageAsync",
                request
            );
        },
        [connection]
    );

    const updateMessages = useCallback(
        (newMessage: SingleConversationMessage) => {
            queryClient.setQueryData<InfiniteData<ConversationMessagesResponse>>(
                ChatKeys.ConversationMessages(newMessage.conversationId),
                (oldData) => {
                    if (!oldData || !oldData.pages) return oldData;

                    const messageExists = oldData.pages.some((page) =>
                        Array.isArray(page) && page.some((m) => m?.id === newMessage.id)
                    );

                    if (messageExists) return oldData;

                    const updatedPages = [...oldData.pages];

                    if (updatedPages.length > 0) {
                        updatedPages[0] = [...(updatedPages[0] ?? []), newMessage];
                    } else {
                        updatedPages[0] = [newMessage];
                    }


                    return {
                        ...oldData,
                        pages: updatedPages,
                    };
                }
            );
        },
        [queryClient]
    );

    const sentUpdateStatus = useCallback(
        async (newMessage: SingleConversationMessage) => {
            if (
                !connection ||
                !isConnected ||
                newMessage.conversationId !== conversationId ||
                newMessage.senderId === currentUserId
            ) {
                return;
            }

            try {
                await connection.invoke(
                    "ConfirmMessagesByStatus",
                    [newMessage.id],
                    "Read",
                    conversationId
                );
            } catch (error) {
                console.error("Failed to confirm live message as read:", error);
            }
        },
        [connection, isConnected, conversationId, currentUserId]
    );

    const playSound = useCallback(
        (_newMessage: SingleConversationMessage) => {
            playMessageSound();
        },
        []
    );


    useEffect(() => {
        const unsubscribeUpdateMessages =
            subscribeToMessage(updateMessages);

        const unsubscribePlaySound =
            subscribeToMessage(playSound);
        const unsubscribeSentUpdateStatus = subscribeToMessage(sentUpdateStatus)
        return () => {
            unsubscribeUpdateMessages();
            unsubscribePlaySound();
            unsubscribeSentUpdateStatus();
        };
    }, [
        subscribeToMessage,
        updateMessages,
        playSound,
        sentUpdateStatus
    ]);

    const UpdateMessageStatus = useCallback(({ messageIds, status, conversationId }: MessagesStatusResponse) => {
        queryClient.setQueryData<InfiniteData<ConversationMessagesResponse>>(
            ChatKeys.ConversationMessages(conversationId),
            (oldData) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map(page =>
                        page?.map(message =>
                            messageIds.includes(message.id)
                                ? { ...message, status }
                                : message
                        )
                    )
                };
            }
        );
    }, [queryClient])



    useEffect(() => {
        if (!connection) return;

        const unsubscribeUpdateMessagesStatus =
            subscribeToMessageStatus(UpdateMessageStatus);



        return () => {
            unsubscribeUpdateMessagesStatus();
        };

    }, [queryClient, connection])






    useEffect(() => {
        if (!connection || !isConnected || !conversationId) {
            return;
        }
        const confirmUnReadMessages = async () => {
            try {
                const messageIds = await connection.invoke(
                    "GetMessageIdsByStatus",
                    "Delivered",
                    conversationId
                );
                if (!messageIds.length) return;

                await connection.invoke(
                    "ConfirmMessagesByStatus",
                    messageIds,
                    "Read",
                    conversationId

                );
            } catch (error) {
                console.error(
                    "Failed to confirm messages read:",
                    error
                );
            }
        };
        confirmUnReadMessages();

    }, [connection, conversationId, isConnected]);

    return { sendMessage };
}