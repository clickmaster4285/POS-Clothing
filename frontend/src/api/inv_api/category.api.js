

import api from "../axios";


export const getCategories = async (params = {}) => {
  const res = await api.get("/categories");
  return res.data;
};



// 🔹 GET flat categories only (useful for dropdowns)
export const getFlatCategories = async () => {
  const res = await api.get("/categories");
  return res.data.flatData;
};

// 🔹 GET single category
export const getCategoryById = async (id) => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

// 🔹 CREATE category
export const createCategory = async (data) => {
 
  const res = await api.post("/categories", data);
  return res.data;
};

// 🔹 UPDATE category
export const updateCategory = async ({ id, data }) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

// 🔹 SOFT DELETE category
export const toggleCategoryStatus = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// 🔹 CATEGORY + BRAND analytics
export const getCategoryBrandAnalytics = async () => {
  const res = await api.get("/categories/analytics");
  return res.data;
};
