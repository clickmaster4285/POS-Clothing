import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  toggleBrandStatus,
} from "@/api/inv_api/brand.api";

// 🔹 Fetch all brands
export const useBrands = (params = {}) => {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => getBrands(params),
  });
};

// 🔹 Fetch single brand
export const useBrand = (id) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id),
    enabled: !!id,
  });
};

// 🔹 Create brand
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

// 🔹 Update brand
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

// 🔹 Delete / deactivate brand
export const useToggleBrandStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBrandStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};
