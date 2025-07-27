import { z } from "zod";
const AddToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1).default(1),
  actionType: z.enum(["BUY", "RENT"]),
  rentalStartDate: z.string().datetime().optional(),
  rentalEndDate: z.string().datetime().optional(),
  priceAtTime: z.number(),
});
const updateCartItemSchema = z.object({
  quantity: z.number().min(1).optional(),
  actionType: z.enum(["BUY", "RENT"]).optional(),
  rentalStartDate: z.string().datetime().optional(),
  rentalEndDate: z.string().datetime().optional(),
});
export { AddToCartSchema, updateCartItemSchema };
