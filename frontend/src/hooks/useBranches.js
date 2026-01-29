import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  toggleBranchStatus ,
} from "@/api/branch.api";

// 🔹 Fetch all branches
export const useBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  });
};

// 🔹 Fetch single branch
export const useBranch = (id) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
  });
};

// 🔹 Create branch (MUTATION)
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

// 🔹 Update branch (MUTATION)
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

// 🔹 Delete branch (MUTATION)
export const useToggleBranchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBranchStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};
