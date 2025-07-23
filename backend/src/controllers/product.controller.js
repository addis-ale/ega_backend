import { createProductSchema } from "../schema/productSchema.js";
import prisma from "../lib/prismadb.js";
import { includes, z } from "zod";

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

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const query = {};
  const cat = req.query.cat;
  const maxprice = req.query.maxprice;
  const minprice = req.query.minprice;
  const type = req.query.type;
  const sortQuery = req.query.sortQuery;
  const searchQuery = req.query.searchQuery;
  if (cat) {
    const categories = Array.isArray(cat) ? cat : [cat];
    query.productCategory = { in: categories };
  }
  if (minprice || maxprice) {
    query.OR = [
      {
        productSellingPrice: {
          ...(minprice && { gte: Number(minprice) }),
          ...(maxprice && { lte: Number(maxprice) }),
        },
      },
      {
        productRentalPrice: {
          ...(minprice && { gte: Number(minprice) }),
          ...(maxprice && { lte: Number(maxprice) }),
        },
      },
    ];
  }
  if (type) {
    query.productType = type;
  }
  if (searchQuery) {
    query.productName = {
      contains: searchQuery,
      mode: "insensitive",
    };
  }

  let sort = {};
  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sort = { createdAt: "desc" };
        break;
      case "lowtohigh":
        sort = { productSellingPrice: "asc" };
        break;
      case "hightolow":
        sort = { productSellingPrice: "desc" };
        break;
      //TODO: add for popular based on the number of visit
      default:
        break;
    }
  }
  const products = await prisma.product.findMany({
    where: query,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sort,
  });
  const totalProduct = await prisma.product.count();
  const hasMore = limit * page < totalProduct;
  res.status(200).json({ products, totalProduct, hasMore });
};
export const getProduct = async (req, res) => {};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};
