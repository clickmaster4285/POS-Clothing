// hooks/useDiscountPromotion.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "@/api/pos/discountPromotionApi";

// 🔹 Fetch all promotions - FIXED to always return array



export const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotions,
  });
};


// 🔹 Fetch single promotion by ID
export const usePromotionById = (id) => {
  return useQuery({
    queryKey: ["promotions", id],
    queryFn: () => getPromotionById(id),
    enabled: !!id,
  });
};

// 🔹 Create promotion
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

// 🔹 Update promotion
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

// 🔹 Delete promotion
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};