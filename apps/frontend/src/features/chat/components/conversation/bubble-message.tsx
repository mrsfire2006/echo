'use client'

import {
    Bubble,
    BubbleContent,
} from "@/components/ui/bubble"
import { formatMessageTime } from "@/constants"
import { cn } from "@/lib/utils"

interface BubbleMessageProps {
    messageId?: string;
    message: string;
    messageTime: string;
    isSent: boolean;
}

export function BubbleMessage({ message, isSent, messageTime }: BubbleMessageProps) {
    return (
        <div className={cn("flex w-full py-0.5", isSent ? "justify-end" : "justify-start")}>
            <Bubble align={isSent ? "end" : "start"}>
                <BubbleContent
                    className={cn(
                        "px-4 py-3 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-30 rounded-2xl shadow-xs transition-colors", isSent
                        ? "bg-chat-sent! text-chat-sent-foreground! rounded-br-xs"
                        : "bg-chat-received! text-chat-received-foreground! rounded-bl-xs"
                    )}
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-sm leading-relaxed wrap-break-words whitespace-pre-wrap">
                            {message}
                        </p>

                        <span
                            className={cn(
                                "text-[10px] select-none self-end opacity-75 dir-ltr",
                                isSent ? "text-chat-sent-foreground/80" : "text-muted-foreground"
                            )}
                        >
                            {formatMessageTime(messageTime)}
                        </span>
                    </div>
                </BubbleContent>
            </Bubble>
        </div>
    )
}