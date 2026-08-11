import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChatServices } from "./chat-service";
import { ChatKeys } from "./chat-keys";
import {
  ConversationMessagesResponse,
  getConversationMessagesRequest,
  SingleConversationMessage,
} from "./types";

export const useGetUserConversations = (userId: string) => {
  return useQuery({
    queryFn: ChatServices.getUserConversations,
    queryKey: ChatKeys.UserConversations(userId),
    enabled: !!userId,
  });
};

export function useGetConversationMessages(conversationId: string) {
  const PAGE_SIZE = 20;

  return useInfiniteQuery({
    queryKey: ["messages", conversationId],

    queryFn: async ({ pageParam }) => {
      const query: getConversationMessagesRequest = {
        ConversationId: conversationId,
        PageSize: PAGE_SIZE,
        ...(pageParam ? { BeforeMessageId: pageParam } : {}),
      };

      const result = await ChatServices.getConversationMessages(query);
      return result.value;
    },

    initialPageParam: undefined,

    getNextPageParam: (lastPage: ConversationMessagesResponse) => {
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length === 0) {
        return undefined;
      }

      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }

      const oldestMessage = lastPage[lastPage.length - 1];

      return oldestMessage.id;
    },

    enabled: !!conversationId,
  });
}

export const useGetConversationDetails = (conversationId: string) => {
  return useQuery({
    queryFn: () => ChatServices.getConversationDetails(conversationId),
    queryKey: ChatKeys.ConversationDetails(conversationId),
    enabled: !!conversationId,
  });
};
