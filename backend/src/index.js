import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoute from "./routes/webhook.route.js";
import rootRoute from "./routes/rootRoute.route.js";
import { errorMiddleware } from "./middleware/error.js";
import { clerkMiddleware } from "@clerk/express";
dotenv.config({ quiet: true });
const app = express();
app.use(clerkMiddleware());
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/webhook", webhookRoute);
app.use(express.json());
app.use("/api", rootRoute);

app.use(errorMiddleware);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
