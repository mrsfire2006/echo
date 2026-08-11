import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Zap } from "lucide-react";

import { authPagesPaths } from "@/features/auth/paths";
import EchoMark from "@/components/shared/echo-mark";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-10">
      <section
        className="
          w-full
          max-w-3xl
          rounded-3xl
          border
          border-border
          bg-card
          p-8
          shadow-sm
          md:p-12
        "
      >
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <EchoMark />
            <span className="text-2xl mb-5 font-bold tracking-tight">
              Echo
            </span>
          </div>

          {/* Hero */}
          <div className="max-w-2xl space-y-5">
            <h1
              className="
                text-4xl
                font-bold
                leading-tight
                tracking-tight
                text-foreground
                sm:text-5xl
                md:text-6xl
              "
            >
              Chat without limits.
            </h1>

            <p
              className="
                mx-auto
                max-w-xl
                text-base
                leading-7
                text-muted-foreground
                sm:text-lg
              "
            >
              A modern messaging platform built for fast,
              private and real-time communication.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={authPagesPaths.signup}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                px-6
                font-medium
                text-primary-foreground
                shadow-sm
                transition-all
                hover:opacity-90
                active:scale-[0.98]
              "
            >
              Get Started

              <ArrowRight className="size-4" />
            </Link>

            <Link
              href={authPagesPaths.login}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-background
                px-6
                font-medium
                text-foreground
                transition-colors
                hover:bg-accent
                hover:text-accent-foreground
              "
            >
              Login
            </Link>
          </div>

          {/* Features */}
          <div
            className="
              mt-12
              grid
              w-full
              max-w-xl
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >
            <Feature
              icon={Zap}
              title="Real-time"
              description="Instant messaging"
            />

            <Feature
              icon={ShieldCheck}
              title="Private"
              description="Your conversations"
            />

            <Feature
              icon={MessageCircle}
              title="Simple"
              description="Focused experience"
            />
          </div>

          {/* Status */}
          <div
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-secondary
              px-4
              py-2
              text-xs
              text-muted-foreground
            "
          >
            <span className="relative flex size-2.5">
              <span
                className="
                  absolute
                  inline-flex
                  size-full
                  animate-ping
                  rounded-full
                  bg-online
                  opacity-60
                "
              />

              <span className="relative inline-flex size-2.5 rounded-full bg-online" />
            </span>

            <span>Real-time messaging</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        gap-2
        rounded-2xl
        border
        border-border
        bg-background
        px-4
        py-4
      "
    >
      <div
        className="
          flex
          size-9
          items-center
          justify-center
          rounded-xl
          bg-accent
          text-accent-foreground
        "
      >
        <Icon className="size-4" />
      </div>

      <span className="text-sm font-medium text-foreground">
        {title}
      </span>

      <span className="text-xs text-muted-foreground">
        {description}
      </span>
    </div>
  );
}