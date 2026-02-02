import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStockByBranch,
  adjustStock,
  transferStock,
  receiveTransfer,
  getLowStockAlerts,
  getStockHistory,
} from "../api/stock.api";

/* =======================
   QUERY KEYS
======================= */

export const stockKeys = {
  all: ["stock"],
  branch: (branchId) => ["stock", "branch", branchId],
  branchList: (branchId, params = {}) => [
    "stock",
    "branch",
    branchId,
    { ...params },
  ],
  lowStock: (branchId) => ["stock", "low-stock", branchId],
  history: (params = {}) => ["stock", "history", { ...params }],
};

/* =======================
   QUERIES
======================= */

// GET stock by branch
export const useStockByBranch = (branchId, params) =>
  useQuery({
    queryKey: stockKeys.branchList(branchId, params),
    queryFn: () => getStockByBranch({ branchId, params }),
    enabled: Boolean(branchId),
    keepPreviousData: true,
  });

// GET low stock alerts
export const useLowStockAlerts = (branchId) =>
  useQuery({
    queryKey: stockKeys.lowStock(branchId),
    queryFn: () => getLowStockAlerts(branchId),
    enabled: Boolean(branchId),
  });

// GET stock history
export const useStockHistory = (params) =>
  useQuery({
    queryKey: stockKeys.history(params),
    queryFn: () => getStockHistory(params),
  });

/* =======================
   MUTATIONS
======================= */

// ADJUST stock
export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustStock,
    onSuccess: (_, { branchId }) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.branch(branchId) });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(branchId) });
    },
  });
};

// TRANSFER stock
export const useTransferStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all });
    },
  });
};

// RECEIVE transfer
export const useReceiveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receiveTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all });
    },
  });
};
