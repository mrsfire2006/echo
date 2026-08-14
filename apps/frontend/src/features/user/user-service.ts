import { clientFetch } from "@/lib/client/api-client";
import { UserProfileResponse, UsersResponse } from "./types";
import { userApiPaths } from "./paths";

export const UserServices = {
  UserProfile: async () => {
    const result = await clientFetch<UserProfileResponse>(
      `${userApiPaths.userProfile}`,
      {
        method: "GET",
      },
    );
    return result;
  },
  GetUsers: async (username: string) => {
    const params = new URLSearchParams();
    params.append("Username", username);
    const result = await clientFetch<UsersResponse>(
      `${userApiPaths.getUsers}?${params.toString()}`,
    );
    return result;
  },
};
