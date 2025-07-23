import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { productSchemaValues } from "@/lib/validation";

export const useProducts = () => {
  return useQuery<productSchemaValues[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/api/products`
      );
      return res.data;
    },
  });
};
