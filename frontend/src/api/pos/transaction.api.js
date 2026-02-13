import api from "../axios";

// 🔹 GET all transactions
export const getTransactions = async () => {
  const res = await api.get("/transactions");
  return res.data;
};

// 🔹 GET transactions by status (active, held, void)
export const getTransactionsByStatus = async (status) => {
  const res = await api.get(`/transactions/status/${status}`);
  return res.data;
};

// 🔹 GET held transactions
export const getHeldTransactions = async () => {
  const res = await api.get("/transactions/held");
  return res.data;
};

// 🔹 CREATE transaction
export const createTransaction = async (data) => {
  const res = await api.post("/transactions/create", data);
  return res.data;
};

// 🔹 HOLD transaction
export const holdTransaction = async (id) => {
  const res = await api.put(`/transactions/hold/${id}`);
  return res.data;
};

// 🔹 VOID transaction
export const voidTransaction = async (id) => {
  const res = await api.put(`/transactions/void/${id}`);
  return res.data;
};

// 🔹 VOID held transaction
export const voidHeldTransaction = async (id) => {
  const res = await api.put(`/transactions/void-held/${id}`);
  return res.data;
};

// 🔹 GENERATE receipt
export const generateReceipt = async (id) => {
  const res = await api.get(`/transactions/receipt/${id}`);
  return res.data;
};

export const completeHeldTransaction = async (id, payment) => {
 
  const res = await api.patch(`/transactions/held/${id}/complete` , payment);
  return res.data;
};