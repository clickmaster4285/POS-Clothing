

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
// In your useCreateCategory hook or directly in the API call
export const createCategory = async (data) => {
  console.log("📦 createCategory called with data:", data);
  const config = {};
  
  // If it's FormData, don't set Content-Type
  if (data instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data', // Let browser set this
    };
  }
  
  const res = await api.post("/categories", data, config);
  return res.data;
};


// 🔹 UPDATE category
export const updateCategory = async ({ id, data }) => {
  // Create a config object
  const config = {};
  
 
  if (data instanceof FormData) {
    // Don't set Content-Type header - let axios handle it
    // This ensures the multipart boundary is set correctly
    config.headers = {
      // Remove any existing Content-Type and let axios set it
      'Content-Type': undefined,
    };
  }
  
  const res = await api.put(`/categories/${id}`, data, config);
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
