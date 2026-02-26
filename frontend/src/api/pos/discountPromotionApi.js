// api/discountPromotionApi.js
import api from "../axios";

// 🔹 GET all promotions
export const getPromotions = async () => {
  const res = await api.get("/discount");
  return res.data;
};

// 🔹 GET single promotion by ID
export const getPromotionById = async (id) => {
  const res = await api.get(`/discount/${id}`);
  return res.data;
};

// 🔹 CREATE a new promotion
export const createPromotion = async (data) => {
  const res = await api.post("/discount", data);
  return res.data;
};

// 🔹 UPDATE a promotion
export const updatePromotion = async (id, data) => {
  const res = await api.put(`/discount/${id}`, data);
  return res.data;
};

// 🔹 DELETE a promotion
export const deletePromotion = async (id) => {
  const res = await api.delete(`/discount/${id}`);
  return res.data;
};
