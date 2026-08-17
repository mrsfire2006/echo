'use client'
import { useContext } from "react"
import { TypingContext } from "../components/providers/signalR-events/typing-provider";

interface TypingUsers {
    userId?: string
}

export default function useTypingUsers({ userId }: TypingUsers = {}) {

    const context = useContext(TypingContext);

    if (!context) {
        throw new Error(
            "useTypingUsers must be used inside TypingProvider"
        );
    }
    const { typingUsers } = context
    const isTyping = !!userId && typingUsers.includes(userId);
    return { typingUsers, isTyping }
}