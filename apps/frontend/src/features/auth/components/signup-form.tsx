'use client';

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";

import TextField from "@/components/shared/text-field";
import PasswordField from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { authApiPaths, authPagesPaths } from "../paths";
import EchoMark from "../../../components/shared/echo-mark";
import { useRegisterUserCommand } from "../hooks";
import { chatApiPaths, chatPagesPaths } from "@/features/chat/paths";
import { useQueryClient } from "@tanstack/react-query";

interface RegisterFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function RegisterForm({ className, onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    pass: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { mutateAsync: registerAsync, isPending } = useRegisterUserCommand();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.confirm !== form.pass) {
      return setError("Password doesn't match");
    }

    if (!form.name || !form.email || !form.pass) {
      return setError("Please fill all fields");
    }

    try {
      const result = await registerAsync({
        email: form.email,
        username: form.name,
        password: form.pass,
      });

      if (result.isFailure) {
        setError(result.errorMessage ?? "Error");
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          await queryClient.invalidateQueries();
          router.push(chatPagesPaths.chat);
        }
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
        ECHO · NEW SIGNAL
      </div>

      <h1 className="font-heading mb-1.5 text-center text-[22px] font-bold text-foreground">
        Join Echo
      </h1>

      <p className="mb-7 text-center text-[13.5px] leading-relaxed text-muted-foreground">
        Create your account and start connecting instantly.
      </p>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          icon={User}
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          name="name"
          required
        />

        <TextField
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          name="email"
          required
        />

        <PasswordField
          label="Password"
          value={form.pass}
          onChange={handleChange}
          name="pass"
          placeholder="At least 8 characters"
        />

        <PasswordField
          label="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          name="confirm"
          placeholder="Re-enter your password"
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
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-5 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={authPagesPaths.login}
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}