import { api } from "./api";

export const roomService = {
  getAll: () => api.get("/rooms"),

  create: (data: any) => api.post("/rooms", data),

  update: (id: number, data: any) =>
    api.put(`/rooms/${id}`, data),

  delete: (id: number) =>
    api.delete(`/rooms/${id}`),
};