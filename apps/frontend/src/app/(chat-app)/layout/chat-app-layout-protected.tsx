'use client'
import LoadingCircle from "@/components/shared/loading-circle";
import { useGetUserProfile } from "@/features/user/hooks"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatAppLayoutProtected({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: user, isPending } = useGetUserProfile();

    useEffect(() => {
        if (isPending) return;
        if (!user || user.isFailure) {
            router.push("/login");
        }
    }, [user]);

    if (isPending) {
        return (
            <LoadingCircle />
        );
    }


    if (!user || user.isFailure) {
        return null;
    }



    return (
        <>
            {children}
        </>
    )
}