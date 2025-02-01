import { db } from "../lib/db";
import { user, password } from "../lib/db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { hash } from "@/lib/utils";

type User = InferSelectModel<typeof user>;
type NewUser = InferInsertModel<typeof user>;

export const findByEmail = async (email: string): Promise<User | undefined> =>
  await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
    .then((rows) => rows[0]);

interface CreateUser {
  email: string;
  name: string;
  password: string;
}

export const createUser = async (userData: CreateUser) => {
  const hashed_pass = await hash(userData.password);

  const [created_user] = await db
    .insert(user)
    .values({
      email: userData.email,
      name: userData.name,
    })
    .$returningId();

  if (!created_user.id) {
    throw new Error("Failed to create user");
  }

  await db.insert(password).values({
    userId: created_user.id,
    hash: hashed_pass,
  });

  return created_user;
};

export const findById = async (id: string): Promise<User | undefined> =>
  await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1)
    .then((rows) => rows[0]);

export const getAll = async (): Promise<User[]> => await db.select().from(user);


export const updateUserCoins = async (id: string, coins: number) => {
  await db.update(user).set({ coins: coins }).where(eq(user.id, id));
}