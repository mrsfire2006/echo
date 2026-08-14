import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "./auth-service";

export const useLoginUserCommand = () => {
  return useMutation({
    mutationFn: AuthServices.loginAsync,
  });
};



export const useRegisterUserCommand = () => {
  return useMutation({
    mutationFn: AuthServices.registerAsync,
  });
};

export const useLogoutUserCommand = () =>{
  return useMutation({
    mutationFn:AuthServices.logoutAsync
  })
}
