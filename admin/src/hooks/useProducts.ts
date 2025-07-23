import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetProductsResponse } from "@/lib/validation";

export const useProducts = (page: number, limit: number) => {
  return useQuery<GetProductsResponse>({
    queryKey: ["products", page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/api/products`,
        {
          params: {
            page,
            limit,
          },
        }
      );
      return res.data;
    },
  });
};
