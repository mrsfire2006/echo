"use client";

import useMessageDelivered from "@/features/chat/chat-hooks/use-message-delivered";
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


    useMessageDelivered();


    return (
        <main className="flex h-dvh w-full overflow-hidden">


            {/* Sidebar */}
            <aside
                className={cn("border-r border-border bg-sidebar",
                    "min-w-0 overflow-hidden transition-[flex-basis] duration-100  ",
                    isConversationOpen
                        ? "basis-0 "
                        : "basis-full",
                    "md:basis-[320px]"
                )}
            >


                <ChatSidebar />
            </aside>

            {/* Content */}
            <section
                className={cn(
                    "min-w-0 overflow-hidden md:opacity-100 transition-[flex-basis] duration-100",
                    isConversationOpen
                        ? "basis-full opacity-100"
                        : "basis-0  opacity-0",
                    "md:basis-auto md:flex-1"
                )}
            >
                {children}
            </section>
        </main>
    );
}