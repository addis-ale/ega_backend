import { Router } from "express";
import { webhookController } from "../controllers/webhook.controller.js";
import bodyParser from "body-parser";
const webhookRoute = Router();
webhookRoute.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  webhookController
);
export default webhookRoute;
