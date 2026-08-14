import { clientFetch } from "@/lib/client/api-client";
import {
  ConversationDetailsResponse,
  ConversationMessagesResponse,
  CreateConversationRequest,
  getConversationMessagesRequest,
  UserConversationsResponse,
} from "./types";
import { chatApiPaths } from "./paths";

export const ChatServices = {
  getUserConversations: async () => {
    const result = await clientFetch<UserConversationsResponse>(
      `${chatApiPaths.getUserConversations}`,
      {
        method: "GET",
      },
    );
    return result;
  },
  getConversationMessages: async (query: getConversationMessagesRequest) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>,
    ).toString();

    const result = await clientFetch<ConversationMessagesResponse>(
      `${chatApiPaths.getConversationMessages}?${queryString}`,
      {
        method: "GET",
      },
    );
    return result;
  },
  getConversationDetails: async (conversationId: string) => {
    const result = await clientFetch<ConversationDetailsResponse>(
      `${chatApiPaths.getConversationDetails}/:${conversationId}`,
      {
        method: "GET",
      },
    );
    return result;
  },
  createConversation: async (request: CreateConversationRequest) => {
    const result = await clientFetch<string>(
      `${chatApiPaths.createConversation}`,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
    return result;
  },
};
