import { CreateProductFormValues } from "../validation";

// src/lib/mutations/createProduct.ts
export async function createProduct({
  values: product,
  token,
}: {
  values: CreateProductFormValues;
  token: string | null;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
}
