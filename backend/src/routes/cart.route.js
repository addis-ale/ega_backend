import { Router } from "express";
import {
  addToCart,
  myCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";

const cartRoute = Router();
cartRoute.post("/add", addToCart);
cartRoute.get("/", myCart);
cartRoute.put("/:id", updateCartItem);
cartRoute.delete("/:id", removeFromCart);
export default cartRoute;
