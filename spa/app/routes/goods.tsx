import { useEffect, useMemo, useState } from "react";

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  owner: {
    username: string;
    avatar: string;
    rating: number;
  };
  distance: number;
  tags: string[];
  availability: {
    status: "available" | "borrowed" | "maintenance";
    nextAvailable?: string; // ISO date string
    defaultLoanPeriod: number; // days
  };
  condition: "like new" | "good" | "fair";
  addedDate: string; // ISO date
}
const SAMPLE_ITEMS: Item[] = [
  {
    id: "1",
    name: "dewalt power drill",
    description:
      "20v max drill with 2 batteries. perfect for home projects. comes with basic bit set.",
    category: "tools",
    image: "/items/drill.jpg",
    owner: {
      username: "toolmaster",
      avatar: "/avatars/1.jpg",
      rating: 4.9,
    },
    distance: 0.8,
    tags: ["power tools", "diy", "home improvement"],
    availability: {
      status: "available",
      defaultLoanPeriod: 7,
    },
    condition: "good",
    addedDate: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "4-person tent",
    description:
      "rei half dome. waterproof, easy setup. great for weekend camping. includes footprint.",
    category: "camping",
    image: "/items/tent.jpg",
    owner: {
      username: "outdoorsy",
      avatar: "/avatars/2.jpg",
      rating: 4.7,
    },
    distance: 1.2,
    tags: ["outdoor", "camping", "backpacking"],
    availability: {
      status: "borrowed",
      nextAvailable: "2024-02-01T00:00:00Z",
      defaultLoanPeriod: 14,
    },
    condition: "like new",
    addedDate: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    name: "bread maker",
    description:
      "zojirushi bb-pac20. makes 2lb loaves. barely used, works perfectly.",
    category: "kitchen",
    image: "/items/breadmaker.jpg",
    owner: {
      username: "breadhead",
      avatar: "/avatars/3.jpg",
      rating: 5.0,
    },
    distance: 0.3,
    tags: ["kitchen", "baking", "appliances"],
    availability: {
      status: "maintenance",
      nextAvailable: "2024-01-25T00:00:00Z",
      defaultLoanPeriod: 10,
    },
    condition: "fair",
    addedDate: "2024-01-01T00:00:00Z",
  },
  // add more items as needed
];

// constants.ts
export const CATEGORIES = [
  "tools",
  "camping",
  "kitchen",
  "books",
  "sports",
  "electronics",
  "garden",
  "music",
] as const;

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

export default function PublicItems() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [availability, setAvailability] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // simulated data fetch
  useEffect(() => {
    setLoading(true);
    // simulate api call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [category, availability]);

  const filteredItems = useMemo(() => {
    if (error || loading) return [];

    return SAMPLE_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory = category === "all" || item.category === category;

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" &&
          item.availability.status === "available") ||
        (availability === "soon" &&
          item.availability.status === "borrowed" &&
          new Date(item.availability.nextAvailable!) <=
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      const matchesDateRange =
        !dateRange[0] ||
        !dateRange[1] ||
        item.availability.status === "available" ||
        new Date(item.availability.nextAvailable!) <= dateRange[0];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesDateRange
      );
    }).sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "rating":
          return b.owner.rating - a.owner.rating;
        case "newest":
          return (
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );
        case "available":
          if (
            a.availability.status === "available" &&
            b.availability.status !== "available"
          )
            return -1;
          if (
            b.availability.status === "available" &&
            a.availability.status !== "available"
          )
            return 1;
          return 0;
        default:
          return 0;
      }
    });
  }, [search, category, sortBy, availability, dateRange, error, loading]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-4 flex items-center justify-center">
        <div className="border-4 border-black p-8 bg-white font-mono text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white"
          >
            try again →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 space-y-4">
          <h1 className="text-5xl font-black transform -rotate-1">
            available rn
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search items or tags..."
              className="px-4 py-2 border-4 border-black font-mono bg-white/50 backdrop-blur col-span-full"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border-4 border-black font-mono bg-white/50 backdrop-blur"
            >
              <option value="all">all categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="px-4 py-2 border-4 border-black font-mono bg-white/50 backdrop-blur"
            >
              <option value="all">any availability</option>
              <option value="available">available now</option>
              <option value="soon">available soon</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-4 border-black font-mono bg-white/50 backdrop-blur"
            >
              <option value="distance">nearest first</option>
              <option value="rating">highest rated</option>
              <option value="newest">newest first</option>
              <option value="available">available first</option>
            </select>

            {/* <DateRangePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(dates) => setDateRange(dates)}
              className="col-span-full"
            /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <LoadingState />
          ) : filteredItems.length === 0 ? (
            <EmptyState message="no items match your search rn... try different filters?" />
          ) : (
            filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}
// components/ItemCard.tsx
const ItemCard = ({ item }: { item: Item }) => {
  const availabilityStyle = {
    available: "bg-green-200",
    borrowed: "bg-yellow-200",
    maintenance: "bg-red-200",
  }[item.availability.status];

  return (
    <div className="group border-4 border-black bg-white p-4 transform hover:-rotate-1 transition-all hover:[box-shadow:8px_8px_0_0_#000]">
      <div className="aspect-square bg-gray-100 mb-4 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
        <div
          className={`absolute top-2 right-2 ${availabilityStyle} px-2 py-1 text-sm font-mono border-2 border-black`}
        >
          {item.availability.status === "borrowed"
            ? `back ${new Date(
                item.availability.nextAvailable!
              ).toLocaleDateString()}`
            : item.availability.status}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-xl mb-2">{item.name}</h3>
        <p className="font-mono text-sm">{item.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map((tag) => (
          <span key={tag} className="text-xs font-mono bg-gray-100 px-2 py-1">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm font-mono mb-4">
        <div className="flex items-center gap-2">
          <img
            src={item.owner.avatar}
            alt={item.owner.username}
            className="w-6 h-6 rounded-full border-2 border-black"
          />
          <span>by @{item.owner.username}</span>
        </div>
        <span className="text-green-600">★ {item.owner.rating}</span>
      </div>

      <button className="w-full px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transform hover:-translate-y-1 transition">
        REQUEST →
      </button>
    </div>
  );
};
