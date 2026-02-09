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
  addVariantQuantity
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
      // Refetch the single product detail
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });

      // Refetch the products list so UI updates everywhere
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};

export const useUpdateVariantPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVariantPrice,
    onSuccess: (_, { productId }) => {
      // Refetch the single product detail
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });

      // Refetch the products list
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};


// ─── Update Variant Quantity Hook ───
export const useAddVariantQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVariantQuantity, // <-- your API function
    onSuccess: (_, { productId }) => {
      // Refetch the single product detail to see updated quantity
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });

      // Optionally refetch the products list so UI updates everywhere
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });
    },
  });
};
