import { ApiSchema } from "@/constants";
import { paths } from "@/schemas/schema";

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
