'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetUserProfile } from "@/features/user/hooks";
import { ChevronRight, LogOut, User } from "lucide-react";
import { useLogoutUserCommand } from "@/features/auth/hooks";
import UserAvatar from "@/features/user/components/user-avatar";

export default function SettingsPage() {
    const router = useRouter();
    const { data: user } = useGetUserProfile();

    const username = user?.value?.userName ?? "";
    const email = user?.value?.email ?? "";


    const { mutateAsync: Logout } = useLogoutUserCommand();

    return (
        <section className="mx-auto flex h-full w-full max-w-2xl flex-col gap-6 p-4 md:p-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account and preferences
                </p>
            </header>

            {/* Me / Profile Card */}
            <Link
                href="/settings/profile"
                className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-border/60
                    bg-background/60
                    p-4
                    transition-all
                    duration-200
                    hover:border-primary/40
                    hover:bg-background
                    hover:shadow-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20
                "
            >
                <div
                    className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
  
                        text-lg
                        font-semibold
                        text-primary-foreground
                        shadow-sm
                        transition-transform
                        duration-200
                        group-hover:scale-105
                    "
                >
                    <UserAvatar className="w-full h-full" username={username} id={user?.value?.id} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-base font-semibold text-foreground">
                        {username || "Me"}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                        {email || "View and edit your profile"}
                    </span>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* Settings List */}
            <div className="flex flex-col gap-2 just h00 rounded-2xl border border-border/60 bg-background/60 p-2">
                <Link
                    href="/settings/profile"
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-foreground
                        transition-colors
                        duration-150
                        hover:bg-muted
                    "
                >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Edit profile
                </Link>
            </div>

            <div className="mt-auto" />

            {/* Logout */}
            <button
                
                type="button"
                onClick={async () => {
                    const result = await Logout();
                    if (result.isSuccess) {

                        router.push("/")
                    }
                }}
                className="
                    flex
                    items-end
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-destructive/30
                    bg-destructive/5
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-destructive
                    transition-all
                    duration-200
                    hover:border-destructive/50
                    hover:bg-destructive/10
                    focus:outline-none
                    focus:ring-2
                    focus:ring-destructive/20
                    md:hidden
                "
            >
                <LogOut className="h-4 w-4" />
                Log out
            </button>
        </section>
    );
}