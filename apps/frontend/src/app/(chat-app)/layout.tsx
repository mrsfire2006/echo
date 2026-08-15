import ChatAppNavbar from "@/app/(chat-app)/layout/chat-app-navbar";
import React, { Suspense } from "react";
import ChatAppLayoutProtected from "./layout/chat-app-layout-protected";
import LoadingCircle from "@/components/shared/loading-circle";
import SignalRProvider from "@/features/chat/components/providers/signalR-provider";
import { CurrentConversationProvider } from "@/features/chat/components/providers/current-conversation-provider";
import ChatAppProvider from "@/features/chat/components/providers/chat-app-provider";

export default function ChatAppLayout({ children }: { children: React.ReactNode }) {

  return (
    <ChatAppProvider>

      <main className="min-h-screen relative flex flex-col-reverse bg-background md:flex-row">
        <ChatAppNavbar />
        <div className="bg-background flex-1 min-h-full rounded-xl overflow-hidden">
          <Suspense fallback={<LoadingCircle />}>
            {children}
          </Suspense>
        </div>
      </main>
    </ChatAppProvider>

  );
}

