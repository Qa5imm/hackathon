import type { user } from "@/lib/db/schema";
import lucia from "@/lib/auth";
import type { InferColumnsDataTypes, InferSelectModel } from "drizzle-orm";
import type { Context } from "hono";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }

  interface DatabaseUserAttributes extends InferSelectModel<typeof user> {}
}

declare global {
  interface User {
    id: string;
  }

  interface Session {
    id: string;
  }

  interface AppContext extends Context {
    user: User | null;
    session: Session | null;
  }
}
