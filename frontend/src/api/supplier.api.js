import api from "./axios";

/* ===================== SUPPLIER PROFILE ===================== */

// GET all suppliers (with filters & pagination)
export const getSuppliers = async (params = {}) => {
  const res = await api.get("/suppliers", { params });
  return res.data;
};

// GET single supplier full profile
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

// SOFT DELETE supplier (deactivate)
export const deleteSupplier = async (id) => {
  const res = await api.delete(`/suppliers/${id}`);
  return res.data;
};

/* ===================== BANKING DETAILS ===================== */

// ADD banking details
export const addSupplierBank = async ({ supplierId, data }) => {
  const res = await api.post(`/suppliers/${supplierId}/banking`, data);
  return res.data;
};

// GET banking details
export const getSupplierBanks = async (supplierId) => {
  const res = await api.get(`/suppliers/${supplierId}/banking`);
  return res.data;
};

/* ===================== PRODUCT CATALOG ===================== */

// ADD product to catalog
export const addCatalogProduct = async ({ supplierId, data }) => {
  const res = await api.post(`/suppliers/${supplierId}/catalog`, data);
  return res.data;
};

// GET supplier catalog
export const getSupplierCatalog = async (supplierId) => {
  const res = await api.get(`/suppliers/${supplierId}/catalog`);
  return res.data;
};

/* ===================== ORDERS ===================== */

// CREATE order
export const createSupplierOrder = async ({ supplierId, data }) => {
  const res = await api.post(`/suppliers/${supplierId}/orders`, data);
  return res.data;
};

// GET supplier orders
export const getSupplierOrders = async (supplierId) => {
  const res = await api.get(`/suppliers/${supplierId}/orders`);
  return res.data;
};

/* ===================== PAYMENTS ===================== */

// PROCESS payment
export const processSupplierPayment = async ({ supplierId, data }) => {
  const res = await api.post(`/suppliers/${supplierId}/payments`, data);
  return res.data;
};

// GET payment history
export const getSupplierPayments = async (supplierId) => {
  const res = await api.get(`/suppliers/${supplierId}/payments`);
  return res.data;
};

/* ===================== PERFORMANCE ===================== */

export const getPerformanceMetrics = async (supplierId) => {
  const res = await api.get(`/suppliers/${supplierId}/performance`);
  return res.data;
};

export const updatePerformanceMetrics = async (supplierId) => {
  const res = await api.put(`/suppliers/${supplierId}/performance`);
  return res.data;
};

/* ===================== DASHBOARD ===================== */

export const getSupplierDashboard = async (supplierId) => {
  const res = await api.get(`/suppliers/${supplierId}/dashboard`);
  return res.data;
};
