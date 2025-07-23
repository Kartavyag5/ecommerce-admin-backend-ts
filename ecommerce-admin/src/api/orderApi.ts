// api/orderApi.ts
import API from './axios'; // your axios instance

export const getOrders = async (params = {}) => {
  const response = await API.get("/orders", { params });
  return response.data;
};


export const createOrder = async (order: any) => {
  const res = await API.post('/orders', order);
  return res.data;
};

export const updateOrder = async (id: number, order: any) => {
  const res = await API.put(`/orders/${id}`, order);
  return res.data;
};

export const deleteOrder = async (id: number) => {
  const res = await API.delete(`/orders/${id}`);
  return res.data;
};
