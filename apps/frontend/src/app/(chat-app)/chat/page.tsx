'use client'

import { DoodleBackground } from "@/features/chat/components/conversation/doodle-background";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
    const router = useRouter();
    return (
        <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background p-6 select-none">
            {/* 1. Full Page WhatsApp-style Doodle Background Pattern */}
            <DoodleBackground />
            {/* Glowing Ambient Light */}
            <div className="absolute h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* 2. Main Center Card */}
            <div className="relative z-10 flex max-w-md flex-col items-center text-center p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/60 shadow-2xl transition-all">

                {/* Floating Glow Icon Container */}
                <div className="relative mb-6">
                    <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary to-primary/50 blur-md opacity-40 animate-pulse" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-background border border-border shadow-inner text-primary">
                        <MessageSquare className="h-10 w-10 stroke-[1.75]" />
                    </div>
                </div>

                {/* Main Heading & Description */}
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                    Select a Conversation
                </h1>

                <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs">
                    Choose a chat from the sidebar to start messaging, view your conversation history, or send files securely.
                </p>

                {/* Security Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 text-xs text-muted-foreground border border-border/50 shadow-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>End-to-end encrypted</span>
                </div>
            </div>

            {/* Bottom Brand Watermark */}
            <div className="absolute bottom-6 text-xs text-muted-foreground/50 tracking-wider font-medium">
                NextChat Web
            </div>
        </section>
    );
}