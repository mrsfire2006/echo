'use client';

import { Button } from "@/components/ui/button";
import { DoodleBackground } from "../conversation/doodle-background";
import ChatNavbar from "./chat-navbar";
import { Search } from "lucide-react";
import UsersSearchDialog from "./users-search-dialog";
 
export default function ChatSidebar() {

    return (
        <aside className="flex h-full w-full flex-col gap-4 px-3 py-4 bg-sidebar">
            {/* Header Area */}
            <header className="flex shrink-0 flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Conversations
                    </h2>

                    <UsersSearchDialog />

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

            <DoodleBackground className="opacity-[0.06] dark:opacity-[0.03] md:hidden block" />
            <ChatNavbar />

        </aside>
    );
}


