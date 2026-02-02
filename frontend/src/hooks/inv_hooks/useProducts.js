import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductVariant,
  updateVariantPrice,
} from "../../api/inv_api/products.api";

/* =======================
   QUERY KEYS
======================= */

export const productKeys = {
  all: ["products"],

  lists: () => ["products", "list"],
  list: (params = {}) => ["products", "list", { ...params }],

  details: () => ["products", "detail"],
  detail: (id, includeStock = false) => [
    "products",
    "detail",
    id,
    includeStock,
  ],
};

/* =======================
   QUERIES
======================= */

// GET products
export const useProducts = (params) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    keepPreviousData: true,
  });

// GET product by ID
export const useProduct = (id, includeStock = false) =>
  useQuery({
    queryKey: productKeys.detail(id, includeStock),
    queryFn: () => getProductById(id, includeStock),
    enabled: Boolean(id),
  });

/* =======================
   MUTATIONS
======================= */

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useAddVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductVariant,
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
    },
  });
};

export const useUpdateVariantPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVariantPrice,
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
    },
  });
};
