// hooks/useSettings.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings ,updateProfile} from "@/api/settings.api";

// 🔹 Fetch settings
export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
};

// 🔹 Update settings (MUTATION)
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data); // update cache immediately
    },
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // optionally update settings cache if user info is stored there
      queryClient.invalidateQueries(["settings"]);
    },
  });
};