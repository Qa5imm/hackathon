import lucia from "@/lib/auth";
import { Hono } from "hono";
import { google } from "@/lib/auth/google";
import {
  generateState,
  generateCodeVerifier,
  type OAuth2Tokens,
  decodeIdToken,
} from "arctic";
import { createUser, findByEmail, findById } from "@/repository/user";
import { hash } from "@/lib/utils";
import { getCookie } from "hono/cookie";

export const authRouter = new Hono()
  .post("/logout", async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({ error: "Not logged in" }, 401);
    }

    await lucia.invalidateSession(session.id);
    const cookie = lucia.createBlankSessionCookie();
    cookie.attributes.domain =
      process.env.ENVIRONMENT === "prod" ? ".gethunar.com" : "localhost";

    c.header("Set-Cookie", cookie.serialize());
    return c.json({ message: "Logged out" });
  })
  // .post("/login", async (c) => {
  //   const { email, password } = await c.req.json();

  //   const [existing_user] = await getUserAndPassword(email);

  //   if (!existing_user) {
  //     return c.json({ error: "Account does not exist" }, 401);
  //   }

  //   const valid_password =
  //     (await hash(password)) === existing_user.password.hash;

  //   if (!valid_password) {
  //     return c.json({ error: "Invalid credentials" }, 401);
  //   }

  //   const session = await lucia.createSession(existing_user.user.id, {});
  //   const cookie = lucia.createSessionCookie(session.id);
  //   cookie.attributes.domain =
  //     process.env.ENVIRONMENT === "prod" ? ".gethunar.com" : "localhost";

  //   c.header("Set-Cookie", cookie.serialize());
  //   return c.json({ message: "Logged in", user: existing_user.user });
  // })
  // .post("/register", async (c) => {
  //   const { email, name, password } = await c.req.json();

  //   const existing_user = await findByEmail(email);

  //   if (existing_user) {
  //     return c.json({ error: "Account already exists" }, 400);
  //   }

  //   const created_user = await createUser({ email, name, password });
  //   if (!created_user) {
  //     return c.json({ error: "Failed to create account" }, 500);
  //   }

  //   const session = await lucia.createSession(created_user.id, {});
  //   const cookie = lucia.createSessionCookie(session.id);
  //   cookie.attributes.domain =
  //     process.env.ENVIRONMENT === "prod" ? ".gethunar.com" : "localhost";

  //   c.header("Set-Cookie", cookie.serialize());
  //   return c.json({ message: "Account created", user: created_user });
  // })
  .get("/google/login", async (c) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = google.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "email",
      "profile",
    ]);

    const cookieDomain =
      process.env.ENVIRONMENT === "prod" ? ".gethunar.com" : "localhost";
    const maxAge = 60 * 10;

    c.header(
      "Set-Cookie",
      `google_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Domain=${cookieDomain}`,
      { append: true },
    );
    c.header(
      "Set-Cookie",
      `google_code_verifier=${codeVerifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Domain=${cookieDomain}`,
      { append: true },
    );

    return c.json({ url: url.toString() });
  })
  .get("/google/callback", async (c) => {
    try {
      const code = c.req.query("code");
      const state = c.req.query("state");
      const storedState = getCookie(c, "google_oauth_state");
      const codeVerifier = getCookie(c, "google_code_verifier");

      if (
        !code ||
        !state ||
        !storedState ||
        !codeVerifier ||
        state !== storedState
      ) {
        return c.json({ error: "Invalid OAuth state" }, 400);
      }

      const tokens = await google.validateAuthorizationCode(code, codeVerifier);
      console.log(tokens);
      const claims = decodeIdToken(tokens.idToken());
      const email = claims.email;
      const name = claims.name;

      const existingUser = await findByEmail(email);

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        const cookie = lucia.createSessionCookie(session.id);
        cookie.attributes.domain =
          process.env.ENVIRONMENT === "prod" ? ".gethunar.com" : "localhost";

        c.header("Set-Cookie", cookie.serialize());
        return c.json({ message: "Logged in with Google", user: existingUser });
      }

      const createdUser = await createUser({ email, name, password: "google" });
      if (!createdUser) {
        return c.json({ error: "Failed to create account" }, 500);
      }

      const session = await lucia.createSession(createdUser.id, {});
      const cookie = lucia.createSessionCookie(session.id);
      cookie.attributes.domain =
        process.env.ENVIRONMENT === "prod" ? ".gethunar.com" : "localhost";

      c.header("Set-Cookie", cookie.serialize());
      return c.json({
        message: "Account created with Google",
        user: createdUser,
      });
    } catch (error) {
      console.log(error);
      return c.json({ error: (error as Error).message }, 500);
    }
  })
  .get("/", async (c) => {
    try {
      const session = c.get("session");

      console.log(session);

      if (!session?.userId) {
        return c.json({ error: "User not found" }, 401);
      }

      const user_data = await findById(session.userId);

      if (!user_data) {
        return c.json({ error: "User data not found" }, 404);
      }

      return c.json({ data: user_data, error: null });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return c.json(
        {
          error: "An error occurred while fetching user data",
        },
        500,
      );
    }
  });
