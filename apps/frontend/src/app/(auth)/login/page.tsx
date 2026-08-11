import { LoginForm } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login — Echo",
    description: "Sign in to continue your conversations.",
};

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4">
            <LoginForm />
        </main>
    );
}