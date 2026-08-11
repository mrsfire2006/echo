import { components } from "./schemas/schema";

export type ApiSchema = components["schemas"];
export const aspApiUrl = process.env.NEXT_PUBLIC_ASP_API_URL;

type BaseHttpResult = ApiSchema["HttpResult"];

export type HttpResult<T = unknown> = Omit<BaseHttpResult, "value"> & {
  value: T;
};

export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function formatMessageTime(dateInput: Date | string | number): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "yesterday";
  }

  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 3600 * 24),
  );
  if (diffInDays < 7) {
    return date.toLocaleDateString("en", { weekday: "long" });
  }

  return date.toLocaleDateString("en", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
