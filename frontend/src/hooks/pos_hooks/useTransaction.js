import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  getTransactionsByStatus,
  getHeldTransactions,
  createTransaction,
  holdTransaction,
  voidTransaction,
  voidHeldTransaction,
    generateReceipt,
  completeHeldTransaction,
} from "@/api/pos/transaction.api";


// 🔹 Fetch all transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
};


// 🔹 Fetch transactions by status
export const useTransactionsByStatus = (status) => {
  return useQuery({
    queryKey: ["transactions", status],
    queryFn: () => getTransactionsByStatus(status),
    enabled: !!status,
  });
};


// 🔹 Fetch held transactions
export const useHeldTransactions = () => {
  return useQuery({
    queryKey: ["transactions", "held"],
    queryFn: getHeldTransactions,
  });
};


// 🔹 Create transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};


// 🔹 Hold transaction
export const useHoldTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: holdTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};


// 🔹 Void transaction
export const useVoidTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voidTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};


// 🔹 Void held transaction
export const useVoidHeldTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voidHeldTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};


// 🔹 Generate receipt
export const useGenerateReceipt = (id) => {
  return useQuery({
    queryKey: ["receipt", id],
    queryFn: () => generateReceipt(id),
    enabled: !!id,
  });
};

export const useCompleteHeldTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payment }) => completeHeldTransaction(id, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "held"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};