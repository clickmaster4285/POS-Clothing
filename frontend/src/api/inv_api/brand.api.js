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

export const createBrand = async (data) => {
  // Create a config object
  const config = {};
  
  // If it's FormData, let axios set the correct Content-Type
  if (data instanceof FormData) {
    // Remove any Content-Type header so axios sets it correctly with boundary
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
    
    // Debug log
    console.log("📦 createBrand with FormData:");
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File (${value.name}, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
  }
  
  const res = await api.post("/brands", data, config);
  return res.data;
};

// 🔹 UPDATE brand
export const updateBrand = async ({ id, data }) => {
  // Create a config object
  const config = {};
  
  // If it's FormData, let axios set the correct Content-Type
  if (data instanceof FormData) {
    // Remove any Content-Type header so axios sets it correctly with boundary
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
    
    // Debug log
    console.log(`📦 updateBrand for ID: ${id} with FormData:`);
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
  } else {
    console.log(`📦 updateBrand for ID: ${id} with JSON:`, data);
  }
  
  const res = await api.put(`/brands/${id}`, data, config);
  return res.data;
};

// 🔹 SOFT DELETE brand
export const toggleBrandStatus = async (id) => {
  const res = await api.delete(`/brands/${id}`);
  return res.data;
};
