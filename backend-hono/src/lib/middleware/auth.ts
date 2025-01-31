import lucia from "@/lib/auth";
import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

// middleware to parse cookie and set user/session in context
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const cookie = c.req.header("Cookie");
  const session_id = lucia.readSessionCookie(cookie ?? "");

  if (!session_id) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(session_id);

  if (session?.fresh) {
    c.res.headers.append(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  }
  if (!session) {
    c.res.headers.append(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }

  c.set("user", user);
  c.set("session", session);
  return next();
};

// middleware to protect routes that require authentication
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return next();
};

export type AuthMiddlewareContext = {
  user: any;
  session: any;
};

export type ProtectedRouteContext = AuthMiddlewareContext;
