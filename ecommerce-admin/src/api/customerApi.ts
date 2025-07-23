import API from "./axios";

export const getAllUsers = async () => {
  const res = await API.get('/customers'); // returns [{ id, name }]
  return res.data.data;
};