import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const leaseApi = {
  getLenderLeases: (lenderId: string) =>
    axios.get(`/leases/lender/${lenderId}`),
  getBorrowerLeases: (borrowerId: string) =>
    axios.get(`/leases/borrower/${borrowerId}`),
  updateLeaseStatus: (id: string, status: LeaseStatus) =>
    axios.patch(`/leases/${id}/status`, { status }),
};

export const useLenderLeases = (lenderId?: string) => {
  return useQuery({
    queryKey: ["leases", "lender", lenderId],
    queryFn: () => leaseApi.getLenderLeases(lenderId!).then((res) => res.data),
    enabled: !!lenderId,
  });
};

export const useBorrowerLeases = (borrowerId?: string) => {
  return useQuery({
    queryKey: ["leases", "borrower", borrowerId],
    queryFn: () =>
      leaseApi.getBorrowerLeases(borrowerId!).then((res) => res.data),
    enabled: !!borrowerId,
  });
};

export const useUpdateLeaseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeaseStatus }) =>
      leaseApi.updateLeaseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};

export const useCreateLease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { itemId: string; duration: number }) =>
      axios.post("/leases", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};

type LeaseStatus = "pending" | "active" | "completed" | "rejected";
