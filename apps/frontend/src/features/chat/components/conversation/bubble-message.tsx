'use client'

import {
    Bubble,
    BubbleContent,
} from "@/components/ui/bubble"
import { formatMessageTime } from "@/constants"
import { cn } from "@/lib/utils"
import { Check, CheckCheck, CircleAlert, Loader2 } from "lucide-react";

export type MessageStatus = "Failed" | "Sending" | "Sent" | "Read" | "Delivered"

interface BubbleMessageProps {
    messageId?: string;
    message: { content: string, status: MessageStatus };
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
                            {message.content}
                        </p>



                        <div className="flex flex-row items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                                {isSent && (
                                    <span
                                        className={cn(
                                            "inline-flex items-center select-none",
                                            message.status === "Read"
                                                ? "text-sky-400"
                                                : "text-chat-sent-foreground/70"
                                        )}
                                    >
                                        {message.status === "Sending" ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : message.status === "Failed" ? (
                                            <CircleAlert className="h-3 w-3 text-destructive" />
                                        ) : message.status === "Sent" ? (
                                            <Check className="h-3 w-3" />
                                        ) : message.status === "Delivered" ? (
                                            <CheckCheck className="h-3 w-3" />
                                        ) : message.status === "Read" ? (
                                            <CheckCheck className="h-3 w-3" />
                                        ) : null}
                                    </span>
                                )}

                                <span
                                    className={cn(
                                        "text-[10px] select-none opacity-75 dir-ltr",
                                        isSent
                                            ? "text-chat-sent-foreground/80"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {formatMessageTime(messageTime)}
                                </span>
                            </div>

                            {isSent && (
                                <span className="text-[11px] font-medium select-none text-chat-sent-foreground/70">
                                    You
                                </span>
                            )}
                        </div>

                    </div>
                </BubbleContent>
            </Bubble>
        </div>
    )
}