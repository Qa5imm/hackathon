import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { user, posts } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Insert users
  const user1 = {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
  };

  const user2 = {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
  };

  await db.insert(user).values([user1, user2]);
  console.log("Sample users created!");

  // Insert posts
  const post1 = {
    title: "My First Post",
    content: "Alice's first post!",
    user_id: "1",
  };

  const post2 = {
    title: "Bob's First Post",
    content: "Bob writes his first post.",
    user_id: "2",
  };

  await db.insert(posts).values([post1, post2]);
  console.log("Sample posts created!");

  // Query examples
  const allUsers = await db.select().from(user);
  console.log("All users:", allUsers);

  const allPosts = await db.select().from(posts);
  console.log("All posts:", allPosts);

  const userPosts = await db.select().from(posts).where(eq(posts.user_id, "1"));
  console.log("Posts from user 1:", userPosts);

  process.exit(0);
}

main();
