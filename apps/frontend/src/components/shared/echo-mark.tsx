'use client'
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Shared brand mark for Echo Chat.
 * size="auth"  -> big pulsing ring version used on Login / Signup
 * size="small" -> compact static version used in the app header
 */
export default function EchoMark({ size = "auth" }) {
  const router = useRouter();
  if (size === "small") {
    return (
      <div onClick={() => {
        router.push("/")
      }}
        className="relative cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <MessageCircle size={17} strokeWidth={2.3} />

        <span className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center">
          <span className="relative h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
        </span>
      </div>
    );
  }

  return (
    <div onClick={() => {
      router.push("/")
    }}
      className="relative cursor-pointer mx-auto mb-5 flex h-16 w-16 items-center justify-center">
      <span className="animate-echo-ping absolute h-12 w-12 rounded-full border border-primary opacity-0 [animation-delay:0s]" />
      <span className="animate-echo-ping absolute h-12 w-12 rounded-full border border-primary opacity-0 [animation-delay:0.9s]" />
      <span className="animate-echo-ping absolute h-12 w-12 rounded-full border border-primary opacity-0 [animation-delay:1.8s]" />

      <div className="relative z-10 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-primary/40">
        <MessageCircle size={17} strokeWidth={2.3} />
      </div>
    </div>
  );
}
