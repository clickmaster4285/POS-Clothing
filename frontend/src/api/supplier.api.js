import api from "./axios";

// GET all suppliers
export const getSuppliers = async () => {
  const res = await api.get("/suppliers");
  return res.data;
};

// GET single supplier by ID
export const getSupplierById = async (id) => {
  const res = await api.get(`/suppliers/${id}`);
  return res.data;
};

// CREATE supplier
export const createSupplier = async (data) => {
 
  const res = await api.post("/suppliers", data);
  return res.data;
};

// UPDATE supplier
export const updateSupplier = async ({ id, data }) => {
  const res = await api.put(`/suppliers/${id}`, data);
  return res.data;
};

// DELETE supplier
export const deleteSupplier = async (id) => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};
