 import {  aspApiUrl, HttpResult } from "@/constants";
import { authApiPaths } from "@/features/auth/paths";
 
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${aspApiUrl}/api/${authApiPaths.refresh}`, {
        method: "POST",
        credentials: "include",
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function clientFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<HttpResult<T>> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const makeRequest = () =>
    fetch(`${aspApiUrl}/api/${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

  let response = await makeRequest();

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await makeRequest();
    } else {
      window.location.href = "/login";
      throw new Error("Session expired. Redirecting to login.");
    }
  }

  const result = (await response.json()) as HttpResult<T>;

  return result;
}