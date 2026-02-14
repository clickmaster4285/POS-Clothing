import api from "../axios";

// 🔹 GET all return/exchange transactions
export const getReturnExchanges = async () => {
  const res = await api.get("/returnExchange");
  return res.data;
};

// 🔹 GET return/exchange by original transaction ID
export const getReturnExchangesByOriginal = async (originalTransactionId) => {
  const res = await api.get(`/returnExchange/original/${originalTransactionId}`);
  return res.data;
};

// 🔹 CREATE a return/exchange
export const createReturnExchange = async (data) => {

  const res = await api.post("/returnExchange/create", data);
  return res.data;
};

// 🔹 VOID a return/exchange
export const voidReturnExchange = async (id) => {
  const res = await api.put(`/returnExchange/void/${id}`);
  return res.data;
};

// 🔹 UPDATE a return/exchange
export const updateReturnExchange = async (id, data) => {
  const res = await api.put(`/returnExchange/update/${id}`, data);
  return res.data;
};

export const getTransactionFullDetails = async (id) => {
  const res = await api.get(`/returnExchange/detail/${id}`);
  return res.data;
};
