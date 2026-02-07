import api from "./axios";

// GET all countries
export const getCountries = async () => {
  const res = await api.get("/locations/countries");
  return res.data;
};

// GET states by country code
export const getStates = async (countryCode) => {
  const res = await api.get(`/locations/states/${countryCode}`);
  return res.data;
};

// GET cities by country code & state code
export const getCities = async (countryCode, stateCode) => {
  const res = await api.get(`/locations/cities/${countryCode}/${stateCode}`);
  return res.data;
};
