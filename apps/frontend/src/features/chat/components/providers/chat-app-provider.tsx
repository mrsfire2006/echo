import ChatAppLayoutProtected from "@/app/(chat-app)/layout/chat-app-layout-protected";
import React from "react";
import SignalRProvider from "./signalR-provider";
import { CurrentConversationProvider } from "./current-conversation-provider";
import { PresenceContextProvider } from "./presence-provider";
import TypingProvider from "./typing-provider";



export default function ChatAppProvider({ children }: { children: React.ReactNode }) {


    return (
        <ChatAppLayoutProtected>
            <SignalRProvider>
                <PresenceContextProvider>
                    <TypingProvider>
                        <CurrentConversationProvider>
                            {children}
                        </CurrentConversationProvider>
                    </TypingProvider>
                </PresenceContextProvider>
            </SignalRProvider>
        </ChatAppLayoutProtected>

    )
}