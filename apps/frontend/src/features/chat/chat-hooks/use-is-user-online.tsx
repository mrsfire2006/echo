"use client";
import { useEffect } from "react";
import usePresence from "../components/providers/presence-provider";
import { useCurrentConversation } from "../components/providers/current-conversation-provider";

export function useIsUserOnline(userId?: string | null) {
  const { onlineUsers } = usePresence();
  const { setCurrentConversation } = useCurrentConversation();
  const isOnline = !!userId && onlineUsers.includes(userId);

  useEffect(() => {
    if (!userId) return;

    setCurrentConversation((prev) =>
      prev ? { ...prev, isOnline } : null
    );
  }, [isOnline, userId, setCurrentConversation]);

  return { isOnline };
}