import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierDashboard,
} from "@/api/supplier.api";

/* ===================== QUERIES ===================== */

// 🔹 All suppliers
export const useSuppliers = (params) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  });
};

// 🔹 Single supplier
export const useSupplier = (id) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
};

// 🔹 Supplier dashboard
export const useSupplierDashboard = (id) => {
  return useQuery({
    queryKey: ["supplier-dashboard", id],
    queryFn: () => getSupplierDashboard(id),
    enabled: !!id,
  });
};

/* ===================== MUTATIONS ===================== */

// 🔹 Create supplier
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

// 🔹 Update supplier
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["supplier", id] });
    },
  });
};

// 🔹 Delete (Deactivate) supplier
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
