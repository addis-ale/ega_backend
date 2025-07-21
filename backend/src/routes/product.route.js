import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const productRoute = Router();
productRoute.post("/", createProduct);
productRoute.get("/", getProducts);
productRoute.get("/:id", getProduct);
productRoute.delete("/:id", deleteProduct);
productRoute.patch("/:id", updateProduct);

export default productRoute;
