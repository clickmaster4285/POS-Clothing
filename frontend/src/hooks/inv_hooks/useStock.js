import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStockByBranch,
  adjustStock,
  recieveStock,
  transferStock,
  receiveTransfer,
  getLowStockAlerts,
  getStockHistory,
  getAllStock,
  getAdjustments,
  getTransfers
} from "../../api/inv_api/stock.api";

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


export const useStock = () => {
  return useQuery({
    queryKey: ["stock"],
    queryFn: getAllStock,
  });
};


export const useAdjustments = () => {
  return useQuery({
    queryKey: ["adjustment"],
    queryFn: getAdjustments,
  });
};



export const useTransfers = () => {
  return useQuery({
    queryKey: ["transfer"],
    queryFn: getTransfers,
  });
};



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
export const useRecieveStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recieveStock,
    onSuccess: (_, { branchId }) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.branch(branchId) });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(branchId) });
    },
  });
};




// ADJUST stock
export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustStock,

    onSuccess: (_, variables) => {
      const { branchId } = variables;

  
      queryClient.invalidateQueries({ queryKey: stockKeys.branch(branchId) });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(branchId) });


      queryClient.invalidateQueries({ queryKey: ["stock"] });

      queryClient.invalidateQueries({ queryKey: ["adjustment"] });
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
