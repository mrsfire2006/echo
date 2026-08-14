import { clientFetch } from "@/lib/client/api-client";
import { LoginUserCommand, RegisterUserCommand } from "./types";
import { authApiPaths } from "./paths";

export const AuthServices = {
  loginAsync: async (command: LoginUserCommand) => {
    const result = await clientFetch(`${authApiPaths.login}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(command),
    });

    return result;
  },
  registerAsync: async (command: RegisterUserCommand) => {
    const result = await clientFetch(`${authApiPaths.signup}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(command),
    });
    return result;
  },
  logoutAsync: async () => {
    const result = await clientFetch(`${authApiPaths.logout}`, {
      method: "POST",
    });
    return result;
  },
};
