import api from "../axios"; // your axios instance

// GET all active customers
export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

export const updateCustomer = async ({ id, data }) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

export const toggleCustomerStatus = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};
