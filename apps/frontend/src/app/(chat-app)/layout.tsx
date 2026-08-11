import ChatAppNavbar from "@/app/(chat-app)/layout/chat-app-navbar";
import React, { Suspense } from "react";
import ChatAppLayoutProtected from "./layout/chat-app-layout-protected";
import LoadingCircle from "@/components/shared/loading-circle";

export default function ChatAppLayout({ children }: { children: React.ReactNode }) {

  return (
    <ChatAppLayoutProtected>

      <main className="min-h-screen relative flex flex-col-reverse bg-background md:flex-row">
        <ChatAppNavbar />
        <div className="bg-background flex-1 min-h-full rounded-xl overflow-hidden">
          <Suspense fallback={<LoadingCircle/>}>
            {children}
          </Suspense>
        </div>
      </main>
    </ChatAppLayoutProtected>
  );
}

