import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as itemRepository from "../../repository/item";
import { requireAuth } from "@/lib/middleware/auth";
import * as userRepository from "@/repository/user";
import { item } from "@/lib/db/schema";

const itemRouter = new Hono();

const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["listed", "leased", "delisted"]),
  coins: z.number().min(0),
  category: z.enum([
    "electronics",
    "clothing",
    "books",
    "sports",
    "tools",
    "other",
  ]),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  coins: z.number().min(0).optional(),
  category: z
    .enum(["electronics", "clothing", "books", "sports", "tools", "other"])
    .optional(),
  status: z.enum(["listed", "leased", "delisted"]).optional(),
});

// Create item
itemRouter.post(
  "/",
  requireAuth,
  zValidator("json", createItemSchema),
  async (c) => {
    const data = await c.req.valid("json");
    const session = c.get("session") as { userId: string };
    const userId = session.userId;
    if (!userId) {
      return c.json({ message: "Unauthorized" }, 403);
    }
    const item = await itemRepository.createItem({
      ...data,
      userId,
    });

    return c.json(item, 201);
  },
);

// Create item
itemRouter.post(
  "/",
  requireAuth,
  zValidator("json", createItemSchema),
  async (c) => {
    const data = await c.req.valid("json");
    const session = c.get("session") as { userId: string };
    const userId = session.userId;
    if (!userId) {
      return c.json({ message: "Unauthorized" }, 403);
    }
    const item = await itemRepository.createItem({
      ...data,
      userId,
    });

    return c.json(item, 201);
  },
);

// Create item
itemRouter.post(
  "/",
  requireAuth,
  zValidator("json", createItemSchema),
  async (c) => {
    const data = await c.req.valid("json");
    const session = c.get("session");
    const userId = session.userId;
    if (!userId) {
      return c.json({ message: "Unauthorized" }, 403);
    }
    const item = await itemRepository.createItem({
      ...data,
      userId,
    });

    return c.json(item, 201);
  },
);

// Get all items
itemRouter.get("/", async (c) => {
  const items = await itemRepository.findAllItems();
  const itemsWithUserData = await Promise.all(
    items.map(async (item) => {
      const user = await userRepository.findById(item.userId);
      return { ...item, user };
    }),
  );
  return c.json(itemsWithUserData);
});

// Get item by id
itemRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const item = await itemRepository.findItemById(id);

  if (!item) {
    return c.json({ message: "Item not found" }, 404);
  }

  const user = await userRepository.findById(item.userId);
  return c.json({ ...item, user });
});

// Get user items
itemRouter.get("/users/:userId/items", async (c) => {
  const userId = c.req.param("userId");
  const session = c.get("session") as { userId: string };
  const sessionId = session.userId;
  let items;
  if (sessionId !== userId) {
    items = await itemRepository.findItemsByUserId(userId, [
      "listed",
      "leased",
    ]);
  } else {
    items = await itemRepository.findItemsByUserId(userId, [
      "listed",
      "leased",
      "delisted",
    ]);
  }

  return c.json(items);
});

itemRouter.patch(
  "/:id",
  requireAuth,
  zValidator("json", updateItemSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const session = c.get("session");
    const userId = session.userId;

    const existingItem = await itemRepository.findItemById(id);
    if (!existingItem) {
      return c.json({ message: "Item not found" }, 404);
    }

    if (existingItem.userId !== userId) {
      return c.json({ message: "Unauthorized" }, 403);
    }

    const updatedItem = await itemRepository.updateItem(id, data);
    return c.json(updatedItem);
  },
);

export default itemRouter;
