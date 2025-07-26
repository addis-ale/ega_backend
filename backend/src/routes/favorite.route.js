import { Router } from "express";
import { favAddRemove } from "../controllers/fav.controller.js";

const favRoute = Router();
favRoute.post("/:id", favAddRemove);
export default favRoute;
