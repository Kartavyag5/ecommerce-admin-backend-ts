import API from './axios';
import type { Product } from '../types/Product';

export const getProducts = (params?: any) => {
  return API.get("/products", { params }).then((res) => res.data);
};

export const createProduct = async (data: Omit<Product, "id">) => {
  return API.post("/products", data);
};

export const updateProduct = async (id: number, data: Partial<Product>) => {
  return API.put(`/products/${id}`, data);
};

export const deleteProduct = async (payload: number | { ids: number[] }) => {
  if (typeof payload === "number") {
    return API.delete(`/products/${payload}`);
  } else if ("ids" in payload) {
    return API.delete("/products", { params: { ids: payload.ids.join(",") } });
  }
};
