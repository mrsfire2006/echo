import ChatAppNavbar from "@/app/(chat-app)/layout/chat-app-navbar";
import React, { Suspense } from "react";
import ChatAppLayoutProtected from "./layout/chat-app-layout-protected";
import LoadingCircle from "@/components/shared/loading-circle";
import SignalRProvider from "@/features/chat/components/providers/signalR-provider/signalR-provider";
import SignalREventsProvider from "@/features/chat/components/providers/signalR-provider/signalR-events-provider";
import { CurrentConversationProvider } from "@/features/chat/components/providers/current-conversation-provider";
import useMessageDelivered from "@/features/chat/chat-hooks/use-message-delivered";

export default function ChatAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatAppLayoutProtected>
      {/* <ChatAppProvider> */}
      <SignalRProvider>
        <SignalREventsProvider>
          <CurrentConversationProvider>

            <main className="min-h-screen relative flex flex-col-reverse bg-background md:flex-row">
              <ChatAppNavbar />
              <div className="bg-background flex-1 min-h-full rounded-xl overflow-hidden">
                <Suspense fallback={<LoadingCircle />}>
                  {children}
                </Suspense>
              </div>
            </main>
          </CurrentConversationProvider>
        </SignalREventsProvider>
      </SignalRProvider>
      {/* </ChatAppProvider> */}
    </ChatAppLayoutProtected>

  );
}

