'use client';

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import TextField from "@/components/shared/text-field";
import PasswordField from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import EchoMark from "../../../components/shared/echo-mark";
import { Mail, Ruler } from "lucide-react";
import { authPagesPaths } from "../paths";
import { useLoginUserCommand } from "../hooks";
import { chatPagesPaths } from "@/features/chat/paths";
import { useQueryClient } from "@tanstack/react-query";

interface LoginFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function LoginForm({ className }: LoginFormProps) {
  const [form, setForm] = useState({
    email: "",
    pass: "",
  });

  const router = useRouter();
  const [error, setError] = useState("");
  const { mutateAsync: loginAsync, isPending } = useLoginUserCommand();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.pass) {
      return setError("Please fill all fields");
    }

    try {
      const result = await loginAsync({
        email: form.email,
        password: form.pass,
      });
      if (result.isFailure) {
        setError(result.errorMessage ?? "Error");


      } else {

        await queryClient.invalidateQueries();
        router.push(chatPagesPaths.chat);

      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-102 overflow-hidden rounded-2xl border border-border bg-card p-9 px-7.5",
        className
      )}
    >
      <EchoMark />

      <div className="mb-1.5 text-center font-mono text-xs tracking-[0.12em] text-primary">
        ECHO · CH-01
      </div>

      <h1 className="font-heading mb-1.5 text-center text-[22px] font-bold text-foreground">
        Welcome Back
      </h1>

      <p className="mb-7 text-center text-[13.5px] leading-relaxed text-muted-foreground">
        Sign in to continue your conversations where you left off.
      </p>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={form.email}
          name="email"
          onChange={handleChange}
          required
        />

        <PasswordField
          label="Password"
          value={form.pass}
          onChange={handleChange}
          name="pass"
          placeholder="••••••••"
        />

        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          disabled={isPending}
          type="submit"
          className={cn(
            isPending && "opacity-70 cursor-not-allowed",
            "font-heading mt-1.5 w-full rounded-xl bg-primary py-7 text-[14.5px] font-bold text-primary-foreground transition-[filter,transform] hover:brightness-110 active:scale-[0.99]"
          )}
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-5 text-center text-[13px] text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href={authPagesPaths.signup}
          className="font-semibold text-primary hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}