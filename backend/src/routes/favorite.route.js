import { Router } from "express";
import { favAddRemove, getFavorites } from "../controllers/fav.controller.js";

const favRoute = Router();
favRoute.post("/:id", favAddRemove);
favRoute.get("/", getFavorites);
export default favRoute;
