import { useUser } from "~/lib/hooks/user";
import { AddItemDialog, EditItemDialog } from "./add-item-form";
import { useNavigate } from "@remix-run/react";
import { useUpdateItem, useUserItems } from "~/lib/hooks/item";

export const UserItems = () => {
  const navigate = useNavigate();
  const userQuery = useUser(navigate);
  const userItemsQuery = useUserItems(userQuery.data?.id);
  const updateItemMutation = useUpdateItem();

  const toggleListDelist = async (
    id: string,
    currentStatus: "listed" | "delisted" | "borrowed"
  ) => {
    const newStatus = currentStatus === "listed" ? "delisted" : "listed";
    if (currentStatus === "borrowed") return; // Can't toggle if borrowed
    await updateItemMutation.mutateAsync({
      id,
      data: { status: newStatus },
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black">ur shared stuff</h1>
        <AddItemDialog />
      </div>

      {userItemsQuery.data?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold mb-2">No items shared yet</h3>
          <p className="text-gray-600">
            Start sharing by adding your first item!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userItemsQuery.data?.map((item: any) => (
            <div
              key={item.id}
              className="border-4 border-black bg-white p-4 transform hover:-rotate-1 transition"
            >
              <div className="aspect-square bg-gray-100 mb-4">
                <img
                  alt={item.name}
                  src={item.image}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl">{item.name}</h3>
                <span
                  className={`${
                    item.status === "listed"
                      ? "bg-green-200"
                      : item.status === "leased"
                      ? "bg-blue-200"
                      : "bg-yellow-200"
                  } px-2 py-1 text-sm font-mono`}
                >
                  {item.status === "listed"
                    ? "available rn"
                    : item.status === "leased"
                    ? "borrowed"
                    : "delisted"}
                </span>
              </div>

              <p className="font-mono text-sm mb-4">{item.description}</p>

              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>category:</span>
                  <span>{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>coins per day:</span>
                  <span>{item.coins}</span>
                </div>
              </div>

              <div className="border-t-2 border-black mt-4 pt-4 flex gap-2">
                <EditItemDialog item={item} />
                <button
                  onClick={() => toggleListDelist(item.id, item.status)}
                  disabled={item.status === "leased"}
                  className="flex-1 px-3 py-2 border-2 border-black text-sm font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                  {item.status === "listed"
                    ? "DELIST"
                    : item.status === "leased"
                    ? "BORROWED"
                    : "LIST"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
