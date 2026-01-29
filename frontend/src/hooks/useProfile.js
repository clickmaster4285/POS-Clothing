import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/authApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
