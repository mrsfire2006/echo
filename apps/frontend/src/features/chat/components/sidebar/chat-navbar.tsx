'use client'

import { useGetUserProfile } from "@/features/user/hooks"
import Link from "next/link"
import { useGetUserConversations } from "../../hooks";
import { usePathname } from "next/navigation";
import { formatMessageTime } from "@/constants";
import UserAvatar from "@/features/user/components/user-avatar";
import { cn } from "@/lib/utils";




export default function ChatNavbar() {
    const { data: user } = useGetUserProfile();

    const pathname = usePathname();
    const { data: conversations, isPending } = useGetUserConversations(user?.value?.id ?? "");

    return (
        <nav className="min-h-0 flex-1  overflow-y-auto px-3 mt-3 scrollbar-thin [scrollbar-color:var(--border)_transparent]">

            {!isPending && (!conversations || conversations.isFailure || conversations.value?.length == 0) && (
                <p className="text-center text-foreground"> No Conversations</p>
            )}
            <div className="flex flex-col gap-1.5">
                {conversations && conversations.value?.map((c) => (
                    <Link
                        data-selected={pathname.includes(c.conversationId)}
                        key={c.conversationId}
                        href={`/chat/${c.conversationId}`}
                        className={cn(
                            "grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200",
                            "bg-transparent hover:bg-sidebar-accent/50 data-[selected=true]:bg-sidebar-accent",
                            "overflow-hidden"
                        )}
                    >
                        <UserAvatar onLine id={c.conversationId} name={c.username} />

                        <div className="flex flex-col min-w-0 justify-center gap-0.5">
                            <span className="font-semibold text-sm text-foreground truncate">
                                {c.username}
                            </span>
                            <p className="text-xs text-muted-foreground truncate">
                                {c.lastMessage}
                            </p>
                        </div>

                        <div className="flex flex-col items-end justify-between self-stretch gap-1">
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                {formatMessageTime(c.lastMessageTime!)}
                            </span>

                            {c.unReadMessage != 0 && (
                                <span className="flex h-5 min-w-5 px-1.5 items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-xs">
                                    {c.unReadMessage}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </nav>
    )
}