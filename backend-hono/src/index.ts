import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRouter } from "./routes/auth";
import { authMiddleware } from "./lib/middleware/auth";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "http://localhost:5173"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    maxAge: 86400, // Cache preflight requests for 24 hours
    allowHeaders: ["Content-Type", "Authorization", "Accept", "trpc-accept"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
  }),
);

app.use("*", authMiddleware); // parse cookies
app.route("/auth", authRouter);
// app.use(protectRoute);

export default app;
