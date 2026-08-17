"use client";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/user/components/user-avatar";
import {
    ChevronLeft,
    EllipsisVertical,
    Phone,
    Video,
} from "lucide-react";
import Link from "next/link";

import { useCurrentConversation } from "../providers/current-conversation-provider";
import UserTypingAvater from "@/features/user/components/user-typing-avatar";
import { usePresence } from "../../chat-hooks/use-presence";
import useTypingUsers from "../../chat-hooks/use-typing.users";

export default function ConversationHeader() {
    const { clearCurrentConversation, currentConversation } =
        useCurrentConversation();
    const { isOnline } = usePresence({ userId: currentConversation?.otherUserId });
    const { isTyping } = useTypingUsers({ userId: currentConversation?.otherUserId });

    return (
        <header className="sticky top-0 z-10 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
            {/* Main Header */}
            <div className="flex h-16 w-full items-center justify-between px-4 py-2">
                {/* Left Side */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Button
                        onClick={clearCurrentConversation}
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                        <Link href="/chat" aria-label="Back to chats">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>

                    {/* User Info */}
                    <div className="flex min-w-0 cursor-pointer items-center gap-3">
                        <UserAvatar
                            onLine={isOnline}
                            username={currentConversation?.username ?? "user"}
                            className="h-10 w-10 shrink-0"
                        />

                        <div className="flex min-w-0 flex-col justify-center">
                            <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
                                {currentConversation?.username ?? "User"}
                            </h3>

                            <div className="mt-0.5 flex items-center gap-1.5">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${isOnline
                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${isOnline
                                            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]"
                                            : "bg-muted-foreground/50"
                                            }`}
                                    />

                                    {isOnline
                                        ? "Online"
                                        : "Offline"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                        title="Start Voice Call"
                        aria-label="Start Voice Call"
                    >
                        <Phone className="h-4.5 w-4.5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                        title="Start Video Call"
                        aria-label="Start Video Call"
                    >
                        <Video className="h-4.5 w-4.5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                        title="More options"
                        aria-label="More options"
                    >
                        <EllipsisVertical className="h-4.5 w-4.5" />
                    </Button>
                </div>
            </div>

            {/* Typing Indicator */}
            <UserTypingAvater
                isTyping={isTyping}
            />
        </header>
    );
}