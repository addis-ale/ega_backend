import { Router } from "express";
import productRoute from "./product.route.js";
import uploadRoute from "./upload.route.js";
const rootRoute = Router();
rootRoute.use("/products", productRoute);
rootRoute.use("/upload", uploadRoute);

export default rootRoute;
