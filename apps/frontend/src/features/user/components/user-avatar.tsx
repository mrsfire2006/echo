"use client";

import { useMemo } from "react";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    username: string;
    id?: string;
    className?: string;
    fallbackClassName?: string;
    onLine?: boolean;
}

function getInitials(name: string): string {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function hashString(str: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}

const AVATAR_PALETTE = [
    "#e11d48", // rose
    "#ea580c", // orange
    "#d97706", // amber
    "#65a30d", // lime
    "#16a34a", // green
    "#059669", // emerald
    "#0d9488", // teal
    "#0891b2", // cyan
    "#0284c7", // sky
    "#2563eb", // blue
    "#4f46e5", // indigo
    "#7c3aed", // violet
    "#9333ea", // purple
    "#c026d3", // fuchsia
    "#db2777", // pink
];

function getAvatarStyle(username: string) {
    if (!username) return { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" };

    const hash = hashString(username);
    const color = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];

    return {
        backgroundColor: color,
        color: "#ffffff",
    };
}

export default function UserAvatar({
    username,
    className,
    fallbackClassName,
    onLine,
}: UserAvatarProps) {
    const { initials, style } = useMemo(() => {
        return {
            initials: getInitials(username),
            style: getAvatarStyle(username),
        };
    }, [username]);
    return (
        <Avatar className={cn("h-10 w-10 shrink-0 shadow-xs", className)}>

            {onLine && <AvatarBadge className={onLine ? "bg-green-500" : "bg-red-500"} />}

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