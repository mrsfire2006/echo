import { cn } from "@/lib/utils";

export function DoodleBackground({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "absolute inset-0 pointer-events-none select-none bg-foreground",
                "opacity-[0.08] dark:opacity-[0.18]",
                className
            )}
            style={{
                maskImage: "url('/doodles.svg')",
                WebkitMaskImage: "url('/doodles.svg')",
                maskRepeat: "repeat",
                maskSize: "320px 320px",
            }}
        />
    );
}