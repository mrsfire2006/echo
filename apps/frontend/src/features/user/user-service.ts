import { clientFetch } from "@/lib/client/api-client";
import { UserProfileResponse } from "./types";
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
};
