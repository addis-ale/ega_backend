import { z } from "zod";
import prisma from "../lib/prismadb.js";
import { AddToCartSchema, updateCartItemSchema } from "../schema/cartSchema.js";

export const addToCart = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
      return res.status(403).json({ error: "Forbidden" });
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
    const rentalDurationDays =
      validatedCartItem.rentalStartDate && validatedCartItem.rentalEndDate
        ? Math.ceil(
            (new Date(validatedCartItem.rentalEndDate).getTime() -
              new Date(validatedCartItem.rentalStartDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;
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
          rentalDurationDays,
          actionType: validatedCartItem.actionType,
          priceAtTime: validatedCartItem.priceAtTime,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: validatedCartItem.productId,
          quantity: validatedCartItem.quantity,
          rentalStartDate: validatedCartItem.rentalStartDate,
          rentalEndDate: validatedCartItem.rentalEndDate,
          rentalDurationDays,
          actionType: validatedCartItem.actionType,
          priceAtTime: validatedCartItem.priceAtTime,
        },
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation Error", issue: error.errors });
    }
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const myCart = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const myCart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!myCart) {
      return res.status(200).json([]); // Empty cart
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: myCart.id,
      },
      include: {
        product: true,
      },
    });

    const filteredCartItem = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product,
      actionType: item.actionType,
      priceAtTime: item.priceAtTime,
      rentalStartDate: item.rentalStartDate,
      rentalEndDate: item.rentalEndDate,
      rentalDurationDays: item.rentalDurationDays,
    }));

    return res.status(200).json(filteredCartItem);
  } catch (error) {
    console.error("[GET_CART_ITEMS_ERROR]", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) return res.status(403).json({ message: "User not found" });

    const cartItemId = parseInt(req.params.id);
    if (isNaN(cartItemId))
      return res.status(400).json({ message: "Invalid cart item ID" });

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== user.id) {
      return res.status(403).json({ message: "Not your cart item" });
    }
    const validatedData = updateCartItemSchema.parse(req.body);
    const { rentalStartDate, rentalEndDate } = validatedData;

    let rentalDurationDays;
    if (rentalStartDate && rentalEndDate) {
      rentalDurationDays = Math.ceil(
        (new Date(rentalEndDate).getTime() -
          new Date(rentalStartDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        ...validatedData,
        rentalStartDate: validatedData.rentalStartDate
          ? new Date(validatedData.rentalStartDate)
          : undefined,
        rentalEndDate: validatedData.rentalEndDate
          ? new Date(validatedData.rentalEndDate)
          : undefined,
        rentalDurationDays,
      },
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("[UPDATE_CART_ITEM_ERROR]", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    const cartItemId = parseInt(req.params.id);
    if (isNaN(cartItemId)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });
    if (!cartItem || cartItem.cart.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "You do not have access to this item" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return res
      .status(200)
      .json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    console.error("[REMOVE_CART_ITEM_ERROR]", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
