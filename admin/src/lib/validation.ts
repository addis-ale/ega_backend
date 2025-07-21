import { z } from "zod";

export const createProductSchema = z.discriminatedUnion("productType", [
  z.object({
    productType: z.literal("SELL"),
    productName: z.string().min(1),
    productDesc: z.string().min(1),
    productCategory: z.enum(["BOARD", "PHYSICAL", "DIGITAL"]),
    productSellingPrice: z.number().min(0, "Selling price must be >= 0"),
    productRentalPrice: z.optional(z.number()),
    productDiscountPercentage: z.number().min(0).max(100).optional(),
    ProductImg: z
      .array(z.string().min(2, { message: "Invalid image URL" }))
      .min(1, { message: "At least one image is required" }),
  }),
  z.object({
    productType: z.literal("RENT"),
    productName: z.string().min(1),
    productDesc: z.string().min(1),
    productCategory: z.enum(["BOARD", "PHYSICAL", "DIGITAL"]),
    productRentalPrice: z.number().min(0, "Rental price must be >= 0"),
    productSellingPrice: z.optional(z.number()),
    productDiscountPercentage: z.number().min(0).max(100),
    ProductImg: z
      .array(z.string().min(2, { message: "Invalid image URL" }))
      .min(1, { message: "At least one image is required" }),
  }),
  z.object({
    productType: z.literal("BOTH"),
    productName: z.string().min(1),
    productDesc: z.string().min(1),
    productCategory: z.enum(["BOARD", "PHYSICAL", "DIGITAL"]),
    productSellingPrice: z.number().min(0, "Selling price must be >= 0"),
    productRentalPrice: z.number().min(0, "Rental price must be >= 0"),
    productDiscountPercentage: z.number().min(0).max(100),
    ProductImg: z
      .array(z.string().min(2, { message: "Invalid image URL" }))
      .min(1, { message: "At least one image is required" }),
  }),
]);

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
