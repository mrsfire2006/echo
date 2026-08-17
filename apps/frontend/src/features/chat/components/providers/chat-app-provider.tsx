import ChatAppLayoutProtected from "@/app/(chat-app)/layout/chat-app-layout-protected";
import React from "react";
import { CurrentConversationProvider } from "./current-conversation-provider";



export default function ChatAppProvider({ children }: { children: React.ReactNode }) {


    // <CurrentConversationProvider>
    // </CurrentConversationProvider>
    return (
        { children }
    )
}