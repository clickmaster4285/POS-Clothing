import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReturnExchanges,
  getReturnExchangesByOriginal,
  createReturnExchange,
  voidReturnExchange,
  updateReturnExchange,
} from "@/api/pos/returnExchange.api";

// 🔹 Fetch all return/exchanges
export const useReturnExchanges = () => {
  return useQuery({
    queryKey: ["returnExchanges"],
    queryFn: getReturnExchanges,
  });
};

// 🔹 Fetch return/exchanges by original transaction ID
export const useReturnExchangesByOriginal = (originalTransactionId) => {
  return useQuery({
    queryKey: ["returnExchanges", originalTransactionId],
    queryFn: () => getReturnExchangesByOriginal(originalTransactionId),
    enabled: !!originalTransactionId,
  });
};

// 🔹 Create return/exchange
export const useCreateReturnExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReturnExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnExchanges"] });
    },
  });
};

// 🔹 Void return/exchange
export const useVoidReturnExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voidReturnExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnExchanges"] });
    },
  });
};

// 🔹 Update return/exchange
export const useUpdateReturnExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateReturnExchange(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnExchanges"] });
    },
  });
};
