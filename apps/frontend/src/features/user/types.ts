import { ApiSchema } from "@/constants";

export type UserProfileResponse =
  ApiSchema["HttpResultOfGetUserProfileResponse"]["value"];

export type UsersResponse =
  ApiSchema["HttpResultOfIEnumerableOfGetUserResponse"]['value'];
export type UserResponse = NonNullable<UsersResponse>[number];
