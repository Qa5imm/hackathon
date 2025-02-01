export interface Item {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  coins: number;
  category: "electronics" | "clothing" | "books" | "sports" | "tools" | "other";
  userId: string;
  status: "listed" | "leased" | "delisted";
  created_at: string;
}
