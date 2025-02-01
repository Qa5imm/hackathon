import { useEffect, useMemo, useState } from "react";
import { useItems } from "~/lib/hooks/item";

// components/EmptyState.tsx
const EmptyState = ({ message }: { message: string }) => (
  <div className="col-span-full py-20 text-center font-mono">
    <div className="text-6xl mb-4">🤔</div>
    <p className="text-xl">{message}</p>
  </div>
);

// components/LoadingState.tsx
const LoadingState = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="border-4 border-black bg-white/50 p-4 animate-pulse"
      >
        <div className="aspect-square bg-gray-200 mb-4" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    ))}
  </>
);

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

// goods.tsx
export default function PublicItems() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  // const [itemsQuery, setItems] = useState<Item[]>([]);
  const itemsQuery = useItems();

  const filteredItems = useMemo(() => {
    // if (error || loading) return [];

    return itemsQuery.data
      ?.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description?.toLowerCase().includes(search.toLowerCase()) ??
            false);

        const matchesCategory =
          category === "all" || item.category === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "coins-asc":
            return a.coins - b.coins;
          case "coins-desc":
            return b.coins - a.coins;
          default:
            return 0;
        }
      });
  }, [itemsQuery.data, search, category, sortBy]);

  // simplified item card
  const ItemCard = ({ item }: { item: Item }) => (
    <div className="border-4 border-black bg-white p-4">
      {item.image && (
        <div className="aspect-square bg-gray-100 mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h3 className="font-bold text-xl mb-2">{item.name}</h3>
      {item.description && (
        <p className="font-mono text-sm mb-4">{item.description}</p>
      )}

      <div className="flex justify-between items-center">
        <span className="font-mono">{item.coins} coins</span>
        <span
          className={`px-2 py-1 ${
            item.status === "listed"
              ? "bg-green-200"
              : item.status === "leased"
              ? "bg-yellow-200"
              : "bg-red-200"
          }`}
        >
          {item.status === "listed"
            ? "available rn"
            : item.status === "leased"
            ? "borrowed"
            : "delisted"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 space-y-4">
          <h1 className="text-5xl font-black transform -rotate-1">items</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search..."
              className="px-4 py-2 border-4 border-black"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border-4 border-black"
            >
              <option value="all">all categories</option>
              <option value="electronics">electronics</option>
              <option value="clothing">clothing</option>
              <option value="books">books</option>
              <option value="sports">sports</option>
              <option value="tools">tools</option>
              <option value="other">other</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-4 border-black"
            >
              <option value="newest">newest first</option>
              <option value="coins-asc">cheapest first</option>
              <option value="coins-desc">most expensive first</option>
            </select>
          </div>
        </div>

        {itemsQuery.isPending ? (
          <LoadingState />
        ) : itemsQuery.isError ? (
          <EmptyState message={itemsQuery.error?.message} />
        ) : filteredItems?.length === 0 ? (
          <EmptyState message="no items found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems?.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
