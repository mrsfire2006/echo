import { RegisterForm } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up — Echo",
    description: "Create your account and start connecting instantly.",
};

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4">
            <RegisterForm />
        </main>
    );
}