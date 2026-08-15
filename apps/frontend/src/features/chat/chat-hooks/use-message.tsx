'use client'
import React, { useCallback, useEffect, useState } from "react";
import { useSignalR } from "../components/providers/signalR-provider";
import { ConversationDetailsResponse, ConversationMessagesResponse, SingleConversationMessage, UserConversationsResponse } from "../types";
import { useGetConversationMessages } from "../hooks";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ChatKeys } from "../chat-keys";
import { validate } from "uuid";
import { HttpResult } from "@/constants";
import { playMessageSound } from "@/lib/sound";
import { createContext } from "vm";
import { convertReusedFlightRouterStateToRouteTree } from "next/dist/client/components/segment-cache/cache";

interface UseMessageProps {
    conversationId: string
}
interface MessageRequestProps {
    receiverId: string,
    content: string,
    conversationId: string

}


export default function useMessage({ conversationId }: UseMessageProps) {
    const { connection } = useSignalR();
    const queryClient = useQueryClient();
    const {
        data: messages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetConversationMessages(conversationId);

    useEffect(() => {
        if (!connection || !conversationId) return;


        const handleReceiveMessage = (newMessage: SingleConversationMessage) => {
            queryClient.setQueryData<InfiniteData<ConversationMessagesResponse>>(
                ChatKeys.ConversationMessages(newMessage.conversationId),
                (oldData) => {
                    if (!oldData || !oldData.pages) return oldData;
                    playMessageSound();

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

        }


        connection?.on("ReceivePrivateMessage", handleReceiveMessage);

        return () => {
            connection?.off("ReceivePrivateMessage", handleReceiveMessage);
        }
    }, [connection, queryClient])

    const sendMessage = useCallback(
        async (request: MessageRequestProps) => {
            if (!connection || !conversationId || !request.content.trim() || !validate(request.receiverId)) return;
            const result: HttpResult = await connection.invoke("SendPrivateMessageAsync", request);
            if (result.isSuccess) {
                queryClient.invalidateQueries({ queryKey: ChatKeys.UserConversations });
                playMessageSound();

            }
        },
        [connection, conversationId, queryClient]
    );

    return {
        messages,
        sendMessage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    };
}