import { cn } from "@/lib/utils";

export default function UserTypingAvater({ isTyping, username }: { isTyping: boolean, username?: string }) {
    return (<div
        className={cn(
            "col-span-2 grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out",
            isTyping
                ? "grid-rows-[1fr] opacity-100 mt-1"
                : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
        )}
    >
        <div className="min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {username}
                    </span>

                    <span className="text-gray-400">
                        is typing
                    </span>

                    <span className="ml-1 flex items-center gap-0.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                    </span>
                </div>
            </div>
        </div>
    </div>

    )
}