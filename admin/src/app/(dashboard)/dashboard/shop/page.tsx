"use client";

import { useProducts } from "@/hooks/useProducts";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState } from "react";

export default function ShopPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: getProduct, isLoading, isError } = useProducts(page, limit);
  const products = getProduct?.products;
  if (isLoading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  if (isError || !products) {
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
        <DataTable
          columns={columns}
          data={products}
          page={page}
          onPageChange={setPage}
          pageCount={Math.ceil((getProduct?.totalProduct || 1) / limit)}
        />
      </div>
    </div>
  );
}
