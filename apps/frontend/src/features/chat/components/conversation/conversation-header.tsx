'use client'

import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/user/components/user-avatar";
import { ChevronLeft, EllipsisVertical, Phone, Video } from "lucide-react";
import Link from "next/link";

interface ConversationHeaderProps {
    username: string;
    conversationId: string;
    onLine: boolean;
}

export default function ConversationHeader({ username, conversationId, onLine }: ConversationHeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 py-2 backdrop-blur-md transition-colors">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                    <Link href="/chat" aria-label="Back to chats">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>

                <div className="flex items-center gap-3 min-w-0 cursor-pointer">
                    <UserAvatar onLine={onLine} id={conversationId} name={username} className="h-10 w-10 shrink-0" />

                    <div className="flex flex-col min-w-0 justify-center">
                        <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
                            {username}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-0.5">

                            <span className={`text-xs ${onLine ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                                {onLine ? "Online" : "Offline"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                    title="Start Voice Call"
                >
                    <Phone className="h-4.5 w-4.5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                    title="Start Video Call"
                >
                    <Video className="h-4.5 w-4.5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                    title="More options"
                >
                    <EllipsisVertical className="h-4.5 w-4.5" />
                </Button>
            </div>
        </header>
    );
}