import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ChatServices } from "./chat-service";
import { ChatKeys } from "./chat-keys";
import {
  ConversationMessagesResponse,
  CreateConversationRequest,
  getConversationMessagesRequest,
  SingleConversationMessage,
} from "./types";

export const useGetUserConversations = (userId: string) => {
  return useQuery({
    queryFn: ChatServices.getUserConversations,
    queryKey: ChatKeys.UserConversations,
    enabled: !!userId,
    gcTime: 15 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export function useGetConversationMessages(conversationId: string) {
  const PAGE_SIZE = 20;

  return useInfiniteQuery({
    queryKey: ChatKeys.ConversationMessages(conversationId),

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

      const oldestMessage = lastPage[0];

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

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateConversationRequest) =>
      ChatServices.createConversation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ChatKeys.UserConversations });
    }
  });
};
