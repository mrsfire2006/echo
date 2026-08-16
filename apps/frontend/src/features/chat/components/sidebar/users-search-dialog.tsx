"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SquarePen, Search, MessageSquare, Check, UserPlus2, X } from "lucide-react"
import { useCreateConversation } from "../../hooks"
import { validate } from "uuid"
import { useRouter } from "next/navigation"
import { useGetUserProfile, useGetUsers } from "@/features/user/hooks"
import UserAvatar from "@/features/user/components/user-avatar"
import { useQueryClient } from "@tanstack/react-query"
import usePresence from "../providers/presence-provider"
import { useCurrentConversation } from "../providers/current-conversation-provider"
import { useIsUserOnline } from "../../chat-hooks/use-is-user-online"
import useIsUsersOnline from "../../chat-hooks/use-is-users-online"

export default function UsersSearchDialog() {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const { mutateAsync: CreatConversationAsync, isPending } = useCreateConversation();
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const { getUsersOnline } = useIsUsersOnline();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);


    const { data: users, isFetching } = useGetUsers(searchQuery);

    useEffect(() => {
        if (!users?.value) return;

        const getOnlines = async () => {
            const filterUsers = users.value?.map((u) => u.userId);
            if (!filterUsers) {
                return;
            }
            if (filterUsers && filterUsers.length === 0) {
                setOnlineUsers([]);
                return;
            }

            const result = await getUsersOnline(filterUsers);

            setOnlineUsers(result);
        };

        getOnlines();
    }, [users]);

    const handleSelectUser = (id: string) => {
        setSelectedUserId((prev) => (prev === id ? null : id))
    }

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setSelectedUserId(null);
        setSearchQuery(inputValue.trim());
    }
    const { setCurrentConversation } = useCurrentConversation();


    const handleStartChat = async () => {
        if (!selectedUserId) return
        if (!validate(selectedUserId)) return;
        setError("")
        const result = await CreatConversationAsync({ receiverId: selectedUserId });

        if (result.isSuccess) {
            setOpen(false)
            const isOnline = onlineUsers.includes(selectedUserId);
            const username = users?.value?.find(x => x.userId === selectedUserId)?.username;
            setCurrentConversation({ conversationId: result.value, isOnline, otherUserId: selectedUserId, username: username! })

            router.push(`/chat/${result.value}`)
        }
        else if (result.isFailure) {
            setError(result.errorMessage ?? "")
        }
        setSelectedUserId(null)
        setSearchQuery("")
        setInputValue("")
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
                setInputValue("");
                setSearchQuery("");
                setSelectedUserId(null);
            }
        }}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-200 hover:opacity-90 active:scale-95"
                    title="New Chat"
                >
                    <SquarePen className="h-4.5 w-4.5" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-110 p-0 overflow-hidden gap-0 rounded-2xl">
                {/* الهيدر */}
                <DialogHeader className="p-5 pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                        <UserPlus2 className="h-5 w-5 text-primary" />
                        New Chat
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                        Search for users by name or username to start a conversation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSearch} className="p-4 pb-2 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 flex items-center">
                            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full h-10 pl-9 pr-3 text-sm rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/70"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="h-10 px-4 rounded-xl"
                            disabled={isFetching}
                        >
                            {isFetching ? "Searching..." : "Search"}
                        </Button>
                    </div>
                </form>

                {/* قائمة المستخدمين */}
                <div className="p-2 max-h-70 overflow-y-auto space-y-1 
    [&::-webkit-scrollbar]:w-1.5 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 
    transition-colors">
                    {users && users.isSuccess && users?.value?.length! > 0 ? (
                        users.value!.map((user) => {
                            const isSelected = selectedUserId === user.userId;
                            const isOnline = onlineUsers.includes(user.userId);
                            return (
                                <div
                                    key={user.userId}
                                    onClick={() => handleSelectUser(user.userId)}
                                    className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${isSelected
                                        ? "bg-primary/10 border border-primary/30 shadow-xs"
                                        : "hover:bg-muted/60 border border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                            <UserAvatar onLine={isOnline} username={user.username} />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {user.username}
                                            </span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div
                                            className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs transition-colors group-hover:bg-destructive"
                                            title="Click to deselect"
                                        >
                                            <Check className="h-3.5 w-3.5 group-hover:hidden" />
                                            <X className="h-3.5 w-3.5 hidden group-hover:block" />
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            {searchQuery ? "No users found." : "Type a username and click Search."}
                        </div>
                    )}
                </div>

                {/* الفوتر */}
                <DialogFooter className="p-4 border-t bg-muted/20 flex-row sm:justify-between items-center gap-2">
                    <Button
                        onClick={handleStartChat}
                        disabled={!selectedUserId || isPending}
                        className="w-full sm:w-auto gap-2 rounded-xl transition-all"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Start Chatting
                    </Button>
                    {error && (<span className="text-xs text-red-500">{error}</span>)}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}