"use client";

import { useMemo } from "react";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    name: string;
    id: string;
    className?: string;
    fallbackClassName?: string;
    onLine: boolean
}

function getInitials(name: string): string {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getAvatarSolidHsl(id: string) {
    if (!id) return { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" };

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;

    return {
        backgroundColor: `hsl(${hue}, 65%, 45%)`,
        color: "#ffffff",
    };
}

export default function UserAvatar({
    name,
    id,
    className,
    fallbackClassName,
    onLine
}: UserAvatarProps) {
    const { initials, style } = useMemo(() => {
        return {
            initials: getInitials(name),
            style: getAvatarSolidHsl(id),
        };
    }, [name, id]);

    return (
        <Avatar className={cn("h-10 w-10 shrink-0 shadow-xs", className)}>
            <AvatarBadge className={`${onLine ? "bg-green-500" : "bg-red-500 "}`} />
            <AvatarFallback
                style={style}
                className={cn(
                    "font-bold text-xs uppercase tracking-wider transition-colors",
                    fallbackClassName
                )}
            >
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}