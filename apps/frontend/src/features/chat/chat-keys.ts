export const ChatKeys = {
  UserConversations: (userId: string) => ["user-conversations", userId],
  ConversationsMessages: (conversationId: string) => [
    "messages",
    conversationId,
  ],
  ConversationDetails: (conversationId: string) => [
    "conversation-details",
    conversationId,
  ],
};
