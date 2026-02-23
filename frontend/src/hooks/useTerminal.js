import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTerminals,
  getTerminalById,
  createTerminal,
  updateTerminal,
  
  addUserToTerminal,
  removeUserFromTerminal,
  recordTerminalAction,
} from "@/api/terminal.api";

// 🔹 Fetch all terminals
export const useTerminals = () => {
  return useQuery({
    queryKey: ["terminals"],
    queryFn: getTerminals,
  });
};

// 🔹 Fetch single terminal
export const useTerminal = (id) => {
  return useQuery({
    queryKey: ["terminal", id],
    queryFn: () => getTerminalById(id),
    enabled: !!id,
  });
};

// 🔹 Create terminal
export const useCreateTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTerminal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["terminals"] }),
  });
};

// 🔹 Update terminal
export const useUpdateTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTerminal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["terminals"] }),
  });
};

// 🔹 Delete terminal
// export const useDeleteTerminal = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteTerminal,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["terminals"] }),
//   });
// };

// 🔹 Add user to terminal
// In your useTerminal hook file
export const useAddUserToTerminal = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUserToTerminal,
    onSuccess: (data, variables) => {
      // Invalidate the query
      const terminalId = variables.terminalId || variables.id;
      queryClient.invalidateQueries({ queryKey: ["terminal", terminalId] });
      
      // Call the custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (options.onError) {
        options.onError(error, variables);
      }
    }
  });
};

// 🔹 Remove user from terminal
export const useRemoveUserFromTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeUserFromTerminal,
    onSuccess: (_, variables) => {
      // make sure terminalId is correct
      const terminalId = variables.terminalId || variables.id;
      queryClient.invalidateQueries({ queryKey: ["terminal", terminalId] });
    },
  });
};

// 🔹 Record action
export const useRecordAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordTerminalAction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["terminal", variables.terminalId] });
    },
  });
};
