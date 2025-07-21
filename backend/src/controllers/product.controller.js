import { createProductSchema } from "../schema/productSchema.js";
import prisma from "../lib/prismadb.js";
import { z } from "zod";

export const createProduct = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const validatedData = createProductSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user || user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const product = await prisma.product.create({
      data: validatedData,
    });

    return res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        issues: error.errors,
      });
    }

    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProducts = async (req, res) => {};
export const getProduct = async (req, res) => {};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};
