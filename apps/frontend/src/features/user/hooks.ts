import { useQuery } from "@tanstack/react-query";
import { UserServices } from "./user-service";
import { UserKeys } from "./user-keys";

export const useGetUserProfile = () => {
  return useQuery({
    queryFn: UserServices.UserProfile,
    queryKey: UserKeys.userprofile,
  });
};
