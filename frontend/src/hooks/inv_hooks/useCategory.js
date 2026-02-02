import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getFlatCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  getCategoryBrandAnalytics,
} from "@/api/inv_api/category.api";

// 🔹 Fetch category TREE (default)
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
};

// 🔹 Fetch flat categories (for Select / Dropdown)
export const useFlatCategories = () => {
  return useQuery({
    queryKey: ["categories-flat"],
    queryFn: getFlatCategories,
  });
};

// 🔹 Fetch single category
export const useCategory = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

// 🔹 Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-flat"] });
    },
  });
};

// 🔹 Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-flat"] });
    },
  });
};

// 🔹 Delete / Deactivate category
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCategoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-flat"] });
    },
  });
};

// 🔹 Analytics
export const useCategoryBrandAnalytics = () => {
  return useQuery({
    queryKey: ["category-brand-analytics"],
    queryFn: getCategoryBrandAnalytics,
  });
};
