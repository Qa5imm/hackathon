import { db } from "@/lib/db";
import { session, user } from "@/lib/db/schema";
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

const adapter = new DrizzleMySQLAdapter(db, session, user);

export default new Lucia(adapter, {
  getUserAttributes(database_user_attributes) {
    return database_user_attributes;
  },
});
