import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/api/supplier.api";

// 🔹 Fetch all suppliers
export const useSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });
};

// 🔹 Fetch single supplier
export const useSupplier = (id) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
};

// 🔹 Create supplier (MUTATION)
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

// 🔹 Update supplier (MUTATION)
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

// 🔹 Delete supplier (MUTATION)
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
