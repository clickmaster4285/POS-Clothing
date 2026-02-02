import api from "./axios";

// GET stock by branch
export const getStockByBranch = async ({ branchId, params }) => {
  const res = await api.get(`/stock/branch/${branchId}`, { params });
  return res.data;
};

// ADJUST stock
export const adjustStock = async ({ branchId, data }) => {
  const res = await api.post(`/stock/branch/${branchId}/adjust`, data);
  return res.data;
};

// TRANSFER stock
export const transferStock = async (data) => {
  const res = await api.post("/stock/transfer", data);
  return res.data;
};

// RECEIVE transfer
export const receiveTransfer = async ({ transferId, data }) => {
  const res = await api.post(
    `/stock/transfer/${transferId}/receive`,
    data
  );
  return res.data;
};

// GET low stock alerts
export const getLowStockAlerts = async (branchId) => {
  const res = await api.get(`/stock/branch/${branchId}/low-stock`);
  return res.data;
};

// GET stock history
export const getStockHistory = async (params) => {
  const res = await api.get("/stock/history", { params });
  return res.data;
};
