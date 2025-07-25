// You'll need to create this mutation function
import axios from "axios";
import type { CreateProductFormValues } from "@/lib/validation";

export const updateProduct = async ({
  productId,
  values,
  token,
}: {
  productId: string;
  values: CreateProductFormValues;
  token: string | null;
}) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_ROUTE}/api/products/${productId}`,
    values,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
