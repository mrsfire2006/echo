'use client'
import React, {
    createContext,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";

export interface CurrentConversation {
    conversationId: string;
    otherUserId: string;
    username: string;
    isOnline: boolean;
}

interface CurrentConversationContextValue {
    currentConversation: CurrentConversation | null;
    setCurrentConversation: React.Dispatch<SetStateAction<CurrentConversation | null>>
    clearCurrentConversation: () => void;
}

const CurrentConversationContext =
    createContext<CurrentConversationContextValue | undefined>(
        undefined
    );

export function CurrentConversationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentConversation, setCurrentConversation] =
        useState<CurrentConversation | null>(null);

    const clearCurrentConversation = () => {
        setCurrentConversation(null);
    };

    const value = useMemo(
        () => ({
            currentConversation,
            setCurrentConversation,
            clearCurrentConversation,
        }),
        [currentConversation]
    );

    return (
        <CurrentConversationContext.Provider value={value}>
            {children}
        </CurrentConversationContext.Provider>
    );
}

export function useCurrentConversation() {
    const context = useContext(CurrentConversationContext);

    if (!context) {
        throw new Error(
            "useCurrentConversation must be used inside CurrentConversationProvider"
        );
    }

    return context;
}