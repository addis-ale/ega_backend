import { z } from "zod";
import prisma from "../lib/prismadb.js";
import { AddToCartSchema } from "../schema/cartSchema.js";

export const addToCart = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
      res.status(403).status({ error: "Forbidden" });
    }
    const validatedCartItem = AddToCartSchema.parse(req.body);
    // 1. Get or create Cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }
    //2. check for existing Item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        productId_cartId: {
          productId: validatedCartItem.productId,
          cartId: cart.id,
        },
      },
    });
    //3. update if the item exist
    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + validatedCartItem.quantity,
          rentalStartDate: validatedCartItem.rentalStartDate,
          rentalEndDate: validatedCartItem.rentalEndDate,
          actionType: parse.actionType,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          data: {
            productId: validatedCartItem.productId,
            quantity: existingItem.quantity + validatedCartItem.quantity,
            rentalStartDate: validatedCartItem.rentalStartDate,
            rentalEndDate: validatedCartItem.rentalEndDate,
            actionType: parse.actionType,
          },
        },
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation Error", issue: error.errors });
    }
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const myCart = async (req, res) => {};
export const updateCartItem = async (req, res) => {};
export const removeFromCart = async (req, res) => {};
