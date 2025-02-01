import { db } from "../lib/db";
import { item } from "../lib/db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

type Item = InferSelectModel<typeof item>;
type NewItem = InferInsertModel<typeof item>;

type ItemCategory = "electronics" | "clothing" | "books" | "sports" | "tools" | "other";
type enumItemStatus = "listed"| "leased"| "delisted";
interface CreateItem {
  name: string;
  description?: string;
  image?: string;
  coins: number;
  category: ItemCategory;
  userId: string;
  status: enumItemStatus 
}

interface UpdateItem {
  name?: string;
  description?: string;
  image?: string;
  coins?: number;
  category?: ItemCategory;
  status?: enumItemStatus;
}

export const createItem = async (itemData: CreateItem) => {
  const [created_item] = await db
    .insert(item)
    .values({
      ...itemData,
    })
    .$returningId();

  if (!created_item) {
    throw new Error("Failed to create item");
  }

  return created_item;
};

export const updateItem = async (id: string, itemData: UpdateItem) => {
  const [updated_item] = await db
    .update(item)
    .set({
      ...itemData,
    })
    .where(eq(item.id, id))

  if (!updated_item) {
    throw new Error("Failed to update item");
  }

  return updated_item;
};

export const findItemById = async (id: string): Promise<Item | undefined> => {
  const [found_item] = await db
    .select()
    .from(item)
    .where(eq(item.id, id))
    .limit(1);

  return found_item;
};

export const findAllItems = async (): Promise<Item[]> => {
  return await db
    .select()
    .from(item)
    .orderBy(item.created_at);
};

export const findItemsByUserId = async (userId: string): Promise<Item[]> => {
  return await db
    .select()
    .from(item)
    .where(eq(item.userId, userId))
    .orderBy(item.created_at);
};
