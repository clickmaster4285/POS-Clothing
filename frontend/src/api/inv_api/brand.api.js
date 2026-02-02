import api from "../axios";

// 🔹 GET brands
export const getBrands = async (params = {}) => {
  const res = await api.get("/brands", { params });
  return res.data;
};

// 🔹 GET single brand
export const getBrandById = async (id) => {
  const res = await api.get(`/brands/${id}`);
  return res.data;
};

// 🔹 CREATE brand
export const createBrand = async (data) => {
  const res = await api.post("/brands", data);
  return res.data;
};

// 🔹 UPDATE brand
export const updateBrand = async ({ id, data }) => {
  const res = await api.put(`/brands/${id}`, data);
  return res.data;
};

// 🔹 SOFT DELETE brand
export const toggleBrandStatus = async (id) => {
  const res = await api.delete(`/brands/${id}`);
  return res.data;
};
