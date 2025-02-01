import { useUpdateLeaseStatus } from "~/lib/hooks/lease";

export const LeaseCard = ({
  lease,
  type,
}: {
  lease: {
    id: string;
    item: {
      id: string;
      name: string;
      description: string;
      image: string;
      coins: number;
      period: number;
      category: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
      coins: number;
      created_at: string;
    };
    status: string;
    duration: number;
    totalAmount: number;
  };
  type: "borrowed" | "request";
}) => {
  console.log("lease", lease);
  const updateLeaseMutation = useUpdateLeaseStatus();

  const handleStatusUpdate = async (
    status: "active" | "completed" | "rejected"
  ) => {
    await updateLeaseMutation.mutateAsync({
      id: lease.id,
      status,
    });
  };

  return (
    <div className="border-4 border-black bg-white p-4 [box-shadow:4px_4px_0_0_#000]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl">{lease.item.name}</h3>
          <p className="text-sm text-gray-600">
            {type === "borrowed" ? "borrowed from:" : "requested by:"} @
            {type === "borrowed" ? lease.user.name : lease.user.name}
          </p>
        </div>
        <span
          className={`
          px-2 py-1 text-sm font-mono
          ${
            lease.status === "pending"
              ? "bg-yellow-200"
              : lease.status === "active"
              ? "bg-green-200"
              : lease.status === "completed"
              ? "bg-blue-200"
              : "bg-red-200"
          }
        `}
        >
          {lease.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>duration:</span>
          <span>{lease.duration} days</span>
        </div>
        <div className="flex justify-between">
          <span>total coins:</span>
          <span>{lease.totalAmount}</span>
        </div>
      </div>

      {type === "request" && lease.status === "pending" && (
        <div className="flex gap-2 mt-4 pt-4 border-t-2 border-black">
          <button
            onClick={() => handleStatusUpdate("active")}
            className="flex-1 px-3 py-2 bg-black text-white font-bold hover:bg-gray-800"
          >
            ACCEPT
          </button>
          <button
            onClick={() => handleStatusUpdate("rejected")}
            className="flex-1 px-3 py-2 border-2 border-black font-bold hover:bg-gray-100"
          >
            REJECT
          </button>
        </div>
      )}

      {type === "borrowed" && lease.status === "active" && (
        <div className="mt-4 pt-4 border-t-2 border-black">
          <button
            onClick={() => handleStatusUpdate("completed")}
            className="w-full px-3 py-2 bg-black text-white font-bold hover:bg-gray-800"
          >
            MARK AS RETURNED
          </button>
        </div>
      )}
    </div>
  );
};
