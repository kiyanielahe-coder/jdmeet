import { api } from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data.data;
};

export const createUser = async (user: any) => {
  const response = await api.post("/users", user);
  return response.data;
};

export const updateUser = async (id: number, user: any) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const changePassword = async (
  id: number,
  password: string
) => {
  const response = await api.put(`/users/${id}/password`, {
    password,
  });

  return response.data;
};