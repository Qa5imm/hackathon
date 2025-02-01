import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

export const ItemCategory = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  BOOKS: 'books',
  SPORTS: 'sports',
  TOOLS: 'tools',
  OTHER: 'other',
} as const

// Add at the top with other imports and enums
export enum leasetatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export const user = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (user) => ({
    email_index: index("email_idx").on(user.email),
    name_index: index("name_idx").on(user.name),
  }),
);

export const password = mysqlTable(
  "password",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => user.id),

    hash: text("hash").notNull(),

    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  }),
);

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => user.id),
    expiresAt: timestamp("expires_at", {
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_session_idx").on(table.userId),
  }),
);

export const item = mysqlTable(
  "item",
  {
    id: varchar("id", { length: 128 })
      .primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => user.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 255 }),
    coins: int("coins").notNull().default(0),
    category: mysqlEnum("category", [
      'electronics',
      'clothing',
      'books',
      'sports',
      'tools',
      'other'
    ] as const).notNull(),
    status: mysqlEnum("status", ["listed", "leased", "delisted"] as const).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_id_items_idx").on(table.userId),
    categoryIdx: index("category_idx").on(table.category),
    nameIdx: index("name_items_idx").on(table.name),
  })
);

export const lease = mysqlTable(
  "lease",
  {
    id: varchar("id", { length: 128 })
      .primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => user.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    image: varchar("image", { length: 255 }),
    coins: int("coins").notNull().default(0),
    category: mysqlEnum("status", ["active", "completed", "overdue"]).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_id_items_idx").on(table.userId),
    categoryIdx: index("category_idx").on(table.category),
    nameIdx: index("name_items_idx").on(table.name),
  })
);