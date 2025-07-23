"use client";

import { formatETB, truncateText } from "@/lib/utils";
import { productSchemaValues } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ActionCell from "./ActionSell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<productSchemaValues>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "productName",
    header: "Name",
    cell: ({ row }) => {
      const name: string = row.getValue("productName");
      return truncateText(name);
    },
  },
  {
    accessorKey: "ProductImg",
    header: "Image",
    cell: ({ row }) => {
      const images: string[] = row.getValue("ProductImg");
      const firstImage = images?.[0];

      return firstImage ? (
        <div className="relative w-12 h-12">
          <Image
            src={firstImage}
            alt="Product image"
            fill
            className="object-cover rounded"
          />
        </div>
      ) : (
        <span>No image</span>
      );
    },
  },

  {
    accessorKey: "productCategory",
    header: "Category",
  },
  {
    accessorKey: "productType",
    header: "For",
  },
  {
    accessorKey: "productSellingPrice",
    header: "Sale Price",
    cell: ({ row }) => {
      const price = row.getValue("productSellingPrice");
      return formatETB(Number(price));
    },
  },
  {
    accessorKey: "productRentalPrice",
    header: "Rental Price",
    cell: ({ row }) => {
      const price = row.getValue("productRentalPrice");
      return formatETB(Number(price));
    },
  },
  {
    accessorKey: "productDiscountPercentage",
    header: "Discount (%)",
    cell: ({ row }) => {
      const discount: number = row.getValue("productDiscountPercentage");
      return `${discount}%`;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
