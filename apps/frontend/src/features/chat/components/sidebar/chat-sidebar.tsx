'use client';

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

                    
 
            </header>

            <DoodleBackground className="opacity-[0.06] dark:opacity-[0.03] md:hidden block" />
            <ChatNavbar />

        </aside>
    );
}


