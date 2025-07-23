import { Row } from "@tanstack/react-table";
import { productSchemaValues } from "@/lib/validation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon, MoreHorizontal } from "lucide-react";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
type ActionCellProps = {
  row: Row<productSchemaValues>;
};

const ActionCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const product = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            {isPending ? (
              <LoaderCircleIcon
                className="-ms-1 animate-spin"
                size={16}
                aria-hidden="true"
              />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/products/${product.id}`)}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/products/${product.id}/edit`)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
              console.log(product.id);
              deleteProduct(product.id, {
                onSuccess: () => toast.success("Product deleted"),
                onError: () => toast.error("Failed to delete product"),
              });
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionCell;
