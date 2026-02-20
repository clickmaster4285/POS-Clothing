import api from "./axios";

// GET all terminals
export const getTerminals = async () => {
  const res = await api.get("/terminals");
  return res.data;
};

// GET single terminal by ID
export const getTerminalById = async (id) => {
  const res = await api.get(`/terminals/${id}`);
  return res.data;
};

// CREATE terminal
export const createTerminal = async (data) => {
  const res = await api.post("/terminals", data);
  return res.data;
};

// UPDATE terminal
export const updateTerminal = async ({ id, data }) => {
  const res = await api.put(`/terminals/${id}`, data);
  return res.data;
};


// ADD user to terminal
export const addUserToTerminal = async ({ id, data }) => {
  console.log("API call to add user to terminal with data:", data, "and terminal ID:", id);
  const res = await api.put(`/terminals/${id}/users`, data);
  return res.data;
};

// REMOVE user from terminal
export const removeUserFromTerminal = async ({ id, userId }) => {
  const res = await api.delete(`/terminals/${id}/users/${userId}`);
  return res.data;
};

// RECORD action
export const recordTerminalAction = async ({ terminalId, data }) => {
  const res = await api.post(`/terminals/${terminalId}/actions`, data);
  return res.data;
};
