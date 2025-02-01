import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as itemRepository from "../../repository/item";
import {requireAuth} from "@/lib/middleware/auth"

const app = new Hono();

const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["listed", "leased", "delisted"]),
  coins: z.number().min(0),
  userId: z.string(),
  category: z.enum(["electronics", "clothing", "books", "sports", "tools", "other"]),

});

export const updateItemSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    coins: z.number().min(0).optional(),
    category: z.enum(["electronics", "clothing", "books", "sports", "tools", "other"]).optional(),
    status: z.enum(["listed", "leased", "delisted"]).optional(),
  });
  

// Create item
app.post("/", requireAuth, zValidator("json", createItemSchema), async (c) => {
  const data =  await c.req.valid("json");
  const session = c.get("session") as { userId: string };
  const userId= session.userId;
if(!userId){    
    return c.json({ message: "Unauthorized" }, 403); }
  const item = await itemRepository.createItem({
    ...data,
    userId,
  });

  return c.json(item, 201);
});

// Get all items
app.get("/", async (c) => {
  const items = await itemRepository.findAllItems();
  return c.json(items);
});

// Get item by id
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const item = await itemRepository.findItemById(id);

  if (!item) {
    return c.json({ message: "Item not found" }, 404);
  }

  return c.json(item);
});

// Get user items
app.get("/users/:userId/items", async (c) => {
  const userId = c.req.param("userId");
  const items = await itemRepository.findItemsByUserId(userId);
  return c.json(items);
});

// Update item
app.patch("/:id", requireAuth, zValidator("json", updateItemSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const session = c.get("session") as { userId: string };
  const userId= session.userId ;

  const existingItem = await itemRepository.findItemById(id);
  if (!existingItem) {
    return c.json({ message: "Item not found" }, 404);
  }

  if (existingItem.userId !== userId) {
    return c.json({ message: "Unauthorized" }, 403);
  }

  const updatedItem = await itemRepository.updateItem(id, data);
  return c.json(updatedItem);
});

export default app; 