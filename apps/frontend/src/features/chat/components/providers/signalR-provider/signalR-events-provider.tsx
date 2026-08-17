'use client'

import MessageProvider from "../signalR-events/message-provider"
import PresenceProvider from "../signalR-events/presence-provider"
import TypingProvider from "../signalR-events/typing-provider"

export default function SignalREventsProvider({ children }: { children: React.ReactNode }) {


    return (
        <PresenceProvider>
            <TypingProvider>
                <MessageProvider>
                    {children}
                </MessageProvider>
            </TypingProvider>
        </PresenceProvider>


    )
}