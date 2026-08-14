export const ChatKeys = {
  UserConversations: ["user-conversations"],
  ConversationsMessages: (conversationId: string) => [
    "messages",
    conversationId,
  ],
  ConversationDetails: (conversationId: string) => [
    "conversation-details",
    conversationId,
  ],
  ConversationMessages: (conversationId: string) => [
    "messages",
    conversationId,
  ],
};
