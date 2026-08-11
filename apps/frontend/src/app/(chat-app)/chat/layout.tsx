"use client";

import ChatSidebar from "@/features/chat/components/sidebar/chat-sidebar";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const isConversationOpen = !!params.conversationId;

    return (
        <main className="flex h-dvh w-full overflow-hidden">


            {/* Sidebar */}
            <aside
                className={cn("border-r border-border bg-sidebar",
                    "min-w-0 overflow-hidden transition-[flex-basis] duration-100  ",
                    isConversationOpen  
                        ? "basis-0"
                        : "basis-full",
                    "md:basis-[320px]"
                )}
            >


                <ChatSidebar />
            </aside>

            {/* Content */}
            <section
                className={cn(
                    "min-w-0 overflow-hidden transition-[flex-basis] duration-100",
                    isConversationOpen
                        ? "basis-full"
                        : "basis-0",
                    "md:basis-auto md:flex-1"
                )}
            >
                {children}
            </section>
        </main>
    );
}