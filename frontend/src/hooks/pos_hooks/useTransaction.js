import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  getHeldTransactions,
  createTransaction,
  voidTransaction,
  voidHeldTransaction,
  completeHeldTransaction,
  getTransactionsByCustomer
} from "@/api/pos/transaction.api";


// 🔹 Fetch all transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
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

export const useTransactionsByCustomer = (customerId) => {
  return useQuery({
    queryKey: ["transactions", "customer", customerId],
    queryFn: () => getTransactionsByCustomer(customerId),
    enabled: !!customerId, // only fetch if customerId is provided
  });
};