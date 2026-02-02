import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTags,
  createTag,
  applyTagToProduct,
  removeTagFromProduct,
} from "@/api/tag.api";

// 🔹 Fetch tags
export const useTags = (params = {}) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => getTags(params),
  });
};

// 🔹 Create tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

// 🔹 Apply tag to product
export const useApplyTagToProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyTagToProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

// 🔹 Remove tag from product
export const useRemoveTagFromProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTagFromProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
