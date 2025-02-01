import { getImageURL } from "~/lib/utils";
import { Item } from "./types";

// simplified item card
export const ItemCard = ({ item }: { item: Item }) => (
  <div className="border-4 border-black bg-white p-4">
    {item.image && (
      <div className="aspect-square bg-gray-100 mb-4">
        <img
          src={getImageURL(item.image)}
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
