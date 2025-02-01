import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userRouter } from "./routes/user";
import { leaseRouter } from "./routes/lease";
import { authMiddleware, requireAuth } from "./lib/middleware/auth";
import { storageRouter } from "./routes/storage";
import itemRouter from "./routes/item";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:5173",
      "https://providence.lol",
    ],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    maxAge: 86400, // Cache preflight requests for 24 hours
    allowHeaders: ["Content-Type", "Authorization", "Accept", "trpc-accept"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
  }),
);

app.use("*", authMiddleware); // parse cookies
app.route("/storage", storageRouter);
app.route("/leases", leaseRouter);
app.route("/auth", userRouter);
app.route("/items", itemRouter);
// app.use(protectRoute);

export default app;
