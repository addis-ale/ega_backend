import { Router } from "express";
import productRoute from "./product.route.js";
import uploadRoute from "./upload.route.js";
import favRoute from "./favorite.route.js";
const rootRoute = Router();
rootRoute.use("/products", productRoute);
rootRoute.use("/upload", uploadRoute);
rootRoute.use("/favorite", favRoute);

export default rootRoute;
