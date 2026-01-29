import api from "./axios";

// GET all active branches
export const getBranches = async () => {
  const res = await api.get("/branches");
  return res.data;
};

// GET single branch
export const getBranchById = async (id) => {
  const res = await api.get(`/branches/${id}`);
  return res.data;
};

// CREATE branch
export const createBranch = async (data) => {
    console.log("Creating branch with data:", data);
  const res = await api.post("/branches", data);
  return res.data;
};

// UPDATE branch
export const updateBranch = async ({ id, data }) => {
  const res = await api.put(`/branches/${id}`, data);
  return res.data;
};

// SOFT DELETE branch
export const toggleBranchStatus = async (id) => {
  const res = await api.delete(`/branches/${id}`);
  return res.data;
};
