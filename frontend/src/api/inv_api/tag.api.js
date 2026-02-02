import api from "./axios";

// 🔹 GET tags
export const getTags = async (params = {}) => {
  const res = await api.get("/tags", { params });
  return res.data;
};

// 🔹 CREATE tag
export const createTag = async (data) => {
  const res = await api.post("/tags", data);
  return res.data;
};

// 🔹 APPLY tag to product
export const applyTagToProduct = async ({ tagId, productId }) => {
  const res = await api.post(`/tags/${tagId}/apply/${productId}`);
  return res.data;
};

// 🔹 REMOVE tag from product
export const removeTagFromProduct = async ({ tagId, productId }) => {
  const res = await api.delete(`/tags/${tagId}/remove/${productId}`);
  return res.data;
};
