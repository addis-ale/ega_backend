import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/api/products/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
