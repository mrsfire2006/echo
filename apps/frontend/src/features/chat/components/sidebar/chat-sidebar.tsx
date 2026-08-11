'use client';

import ChatNavbar from "./chat-navbar";
import { Search, SquarePen } from "lucide-react";

export default function ChatSidebar() {
    return (
        <aside className="flex h-full w-full flex-col gap-4 px-3 py-4 bg-sidebar">
            {/* Header Area */}
            <header className="flex shrink-0 flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Conversations
                    </h2>

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-200 hover:opacity-90 active:scale-95"
                        title="New Chat"
                    >
                        <SquarePen className="h-4.5 w-4.5" />
                    </button>
                </div>

                {/* Search Bar with Icon */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="
                            h-10
                            w-full
                            rounded-xl
                            border
                            border-border/60
                            bg-chat-search
                            pl-9
                            pr-3
                            text-sm
                            text-foreground
                            placeholder:text-muted-foreground/70
                            transition-all
                            duration-200
                            outline-none

                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/20
                            focus:bg-background
                        "
                    />
                </div>
            </header>

            <ChatNavbar />

        </aside>
    );
}