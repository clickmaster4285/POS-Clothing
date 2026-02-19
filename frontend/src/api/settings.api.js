// api/settings.api.js
import api from "./axios";

// GET settings
export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};

// UPDATE settings
export const updateSettings = async (formData) => {
  // formData should be instance of FormData
  const res = await api.put("/settings", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // important for file upload
    },
  });
  return res.data;
};

export const updateProfile = async (payload) => {

  const res = await api.put(`/settings/profile`, payload);
  return res.data;
};