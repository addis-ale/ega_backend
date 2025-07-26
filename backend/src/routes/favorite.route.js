import { Router } from "express";
import { favAddRemove } from "../controllers/fav.controller.js";

const favRoute = Router();
productRoute.post("/:id", favAddRemove);
export default productRoute;
