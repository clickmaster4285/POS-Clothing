import api from "../axios";

/* =======================
   PRODUCTS
======================= */

export const getProducts = async (params) => {
  const res = await api.get("/products");
  return res.data;
};

export const getProductById = async (id, includeStock = false) => {
  const res = await api.get(`/products/${id}`, {
    params: { includeStock },
  });
  return res.data;
};

export const createProduct = async (data) => {

  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async ({ id, data }) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};


export const addProductVariant = async ({ productId, data }) => {
  const res = await api.post(`/products/${productId}/variants`, data);
  return res.data;
};

export const updateVariantPrice = async ({ productId, variantId, data }) => {
  const res = await api.put(
    `/products/${productId}/variants/${variantId}/price`,
    data
  );
  return res.data;
};
