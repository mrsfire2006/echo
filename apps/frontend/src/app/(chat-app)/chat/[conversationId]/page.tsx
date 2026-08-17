'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMessage } from "@/features/chat/chat-hooks/use-message";
import useTypeUser from "@/features/chat/chat-hooks/use-type-user";
import { BubbleMessage, MessageStatus } from "@/features/chat/components/conversation/bubble-message";
import ConversationHeader from "@/features/chat/components/conversation/conversation-header";
import { DoodleBackground } from "@/features/chat/components/conversation/doodle-background";
import { useCurrentConversation } from "@/features/chat/components/providers/current-conversation-provider";
import { useGetConversationMessages } from "@/features/chat/hooks";
import { useGetUserProfile } from "@/features/user/hooks";
import { Loader2, Send, Smile } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { validate } from "uuid";

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId?.toString() ?? "";
    const isValidId = validate(conversationId);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const topSentinelRef = useRef<HTMLDivElement | null>(null);
    const previousScrollHeightRef = useRef<number>(0);
    const isInitialLoad = useRef(true);
    const isNearBottomRef = useRef(true);
    const lastMessageIdRef = useRef<string | undefined>(undefined);

    const { currentConversation } = useCurrentConversation();

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (!isValidId || !currentConversation) {
            router.push("/chat");
        }
    }, [isValidId, router, currentConversation]);

    const {
        data: messagesPages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetConversationMessages(conversationId);

    const { data: user } = useGetUserProfile();
    const [messageText, setMessageText] = useState("");

    const rawMessages = messagesPages?.pages
        ? messagesPages.pages.slice().reverse().flat()
        : [];

    const messages = Array.from(
        new Map(
            rawMessages
                .filter((m): m is NonNullable<typeof m> => Boolean(m?.id))
                .map((m) => [m.id, m])
        ).values()
    );

    useEffect(() => {
        const sentinel = topSentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    if (containerRef.current) {
                        previousScrollHeightRef.current = containerRef.current.scrollHeight;
                    }
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useLayoutEffect(() => {
        if (containerRef.current && previousScrollHeightRef.current > 0) {
            const container = containerRef.current;
            const scrollDiff = container.scrollHeight - previousScrollHeightRef.current;
            container.scrollTop = scrollDiff;
            previousScrollHeightRef.current = 0;
        }
    }, [messages.length]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const threshold = 150;
            const distanceFromBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;
            isNearBottomRef.current = distanceFromBottom < threshold;
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (messages.length === 0) return;

        if (previousScrollHeightRef.current > 0) return;

        if (isInitialLoad.current) {
            lastMessageIdRef.current = messages[messages.length - 1]?.id;
            scrollToBottom("auto");
            isInitialLoad.current = false;
            return;
        }
    }, [messages.length]);

    // ✅ لما توصل رسالة جديدة فعلية (مش pagination)، ننزل تحت لو المستخدم قريب من الآخر أو الرسالة رسالته هو
    useEffect(() => {
        if (messages.length === 0 || isInitialLoad.current) return;
        if (previousScrollHeightRef.current > 0) return;

        const lastMessage = messages[messages.length - 1];
        if (!lastMessage?.id || lastMessage.id === lastMessageIdRef.current) return;

        lastMessageIdRef.current = lastMessage.id;

        const isOwnMessage = user?.value?.id === lastMessage.senderId;
        if (isOwnMessage || isNearBottomRef.current) {
            scrollToBottom("smooth");
        }
    }, [messages, user?.value?.id]);

    const { handleTyping } = useTypeUser();

    const { sendMessage } = useMessage({ conversationId });

    return (
        <section className="p-3 h-full w-full flex flex-col overflow-hidden">
            <ConversationHeader />

            <Separator orientation="horizontal" className="mx-auto my-2 md:block hidden" />

            <div className="relative flex-1 overflow-hidden">
                <DoodleBackground className="opacity-[0.06] dark:opacity-[0.03]" />

                <div
                    ref={containerRef}
                    className="relative h-full flex flex-col justify-between overflow-y-auto p-4 space-y-4"
                >
                    <div ref={topSentinelRef} className="h-4 w-full flex items-center justify-center">
                        {isFetchingNextPage && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Loading older messages...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        {messages.map((m, index) => {
                            const status = m.status as MessageStatus;
                            return <BubbleMessage
                                key={m?.id}
                                isSent={user?.value?.id === m?.senderId}
                                message={{ content: m?.content ?? "Message Deleted", status: status }}
                                messageTime={m?.createdAt!}
                                messageId={m?.id}

                            />
                        })
                        }
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!messageText.trim()) return;

                            await sendMessage({
                                content: messageText,
                                receiverId: currentConversation?.otherUserId ?? "",
                                conversationId
                            });
                            setMessageText("");
                        }}
                        className="pt-2 sticky bottom-0 z-10"
                    >
                        <div className="flex items-center gap-2 p-2 md:p-2.5 bg-background/80 backdrop-blur-md border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 md:h-11 md:w-11 rounded-full text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <Smile className="w-5 h-5 md:w-6! md:h-6!" />
                            </Button>

                            <Input

                                value={messageText}
                                onChange={(e) => { setMessageText(e.target.value); handleTyping() }}
                                placeholder="Type a message..."
                                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 text-base placeholder:text-muted-foreground/60"
                            />

                            <Button
                                type="submit"
                                size="icon"
                                disabled={!messageText.trim()}
                                className="h-10 w-10 md:h-11 md:w-11 rounded-xl shrink-0 transition-transform active:scale-95 disabled:opacity-40"
                            >
                                <Send className="w-5 h-5" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}