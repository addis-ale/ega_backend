"use client";

import { useProducts } from "@/hooks/useProducts";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function ShopPage() {
  const { data, isLoading, isError } = useProducts();

  if (isLoading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-center py-10 text-red-500">Failed to load products.</p>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center">
          All Products in the Market
        </h1>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
