import { ApiSchema } from "@/constants";
import { paths } from "@/schemas/schema";
import { MessageStatus } from "./components/conversation/bubble-message";

export type UserConversationsResponse =
  ApiSchema["HttpResultOfIEnumerableOfUserConversationResponse"]["value"];

export type SingleUserConversation =
  NonNullable<UserConversationsResponse>[number];

export type getConversationMessagesRequest =
  paths["/api/chat/conversations/direct/messages"]["get"]["parameters"]["query"];

export type ConversationMessagesResponse =
  ApiSchema["HttpResultOfIEnumerableOfChatMessageResponse"]["value"];

export type SingleConversationMessage =
  NonNullable<ConversationMessagesResponse>[number];

export type ConversationDetailsResponse =
  ApiSchema["HttpResultOfConversationDetailsResponse"]["value"];

export type CreateConversationRequest =
  ApiSchema["GetOrCreateConversationRequest"];

export type MessagesStatusResponse = {
  messageIds: string[];
  status: MessageStatus;
  conversationId: string;
};
