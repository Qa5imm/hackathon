import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const itemApi = {
  getItems: () => axios.get("/items"),
  getItem: (id: string) => axios.get(`/items/${id}`),
  getUserItems: (userId: string) => axios.get(`/items/users/${userId}/items`),
  createItem: (data: CreateItemDto) => axios.post("/items", data),
  updateItem: (id: string, data: UpdateItemDto) =>
    axios.patch(`/items/${id}`, data),
};

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => itemApi.getItems().then((res) => res.data),
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => itemApi.getItem(id).then((res) => res.data),
  });
};

export const useUserItems = (userId: string) => {
  return useQuery({
    queryKey: ["items", "user", userId],
    queryFn: () => itemApi.getUserItems(userId).then((res) => res.data),
    enabled: userId !== undefined,
  });
};

export const useCreateItem = () => {
  const utils = useQueryClient();
  return useMutation({
    mutationFn: itemApi.createItem,
    onSuccess: () => {
      utils.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateItem = () => {
  const utils = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemDto }) =>
      itemApi.updateItem(id, data),
    onSuccess: () => {
      utils.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

// types that match your zod schemas
type CreateItemDto = {
  name: string;
  description?: string;
  image?: string;
  status: "listed" | "leased" | "delisted";
  coins: number;
  category: "electronics" | "clothing" | "books" | "sports" | "tools" | "other";
};

type UpdateItemDto = Partial<CreateItemDto>;
