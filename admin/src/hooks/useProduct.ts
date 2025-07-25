import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: [""],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/api/products/${id}`
      );
      return res.data;
    },
  });
};
