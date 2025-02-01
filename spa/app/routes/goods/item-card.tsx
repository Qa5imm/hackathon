import { getImageURL } from "~/lib/utils";
import { Item } from "./types";
import { useCreateLease } from "~/lib/hooks/lease";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";

const leaseSchema = z.object({
  durationDays: z
    .number()
    .min(1, "at least 1 day fam")
    .max(30, "chill, 30 days max"),
});
type LeaseFormData = {
  durationDays: number;
};
const LeaseRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (days: number) => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof leaseSchema>>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      durationDays: 1,
    },
  });
  const onFormSubmit = (data: LeaseFormData) => onSubmit(data.durationDays);

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 border-4 border-black max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold mb-4">for how long tho?</h3>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <input
            {...register("durationDays", {
              required: "this is REQUIRED bestie",
              min: { value: 1, message: "at least 1 day fam" },
              max: { value: 30, message: "chill, 30 days max" },
              valueAsNumber: true,
            })}
            type="number"
            className="w-full px-4 py-2 border-4 border-black mb-2"
          />
          {errors.durationDays && (
            <p className="text-red-500 text-sm mb-4">
              {errors.durationDays.message}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-black text-white font-mono hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "requesting..." : "send it"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-4 border-black font-mono"
            >
              nvm
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

// simplified item card
export const ItemCard = ({ item, userId }: { item: Item; userId?: string }) => {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const createLease = useCreateLease();

  const handleRequest = (days: number) => {
    createLease.mutate(
      {
        itemId: item.id,
        duration: days,
      },
      {
        onSuccess: () => {
          toast({ title: "request sent fr fr" });
          setShowModal(false);
        },
        onError: () =>
          toast({ title: "nah that ain't it chief", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="border-4 border-black bg-white p-4">
      <LeaseRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleRequest}
        isLoading={createLease.isPending}
      />
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
      <div className="flex justify-between items-center mt-4">
        {item.status === "listed" && userId && userId !== item.userId && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-black text-white font-mono hover:bg-gray-800"
          >
            request lease
          </button>
        )}
      </div>
    </div>
  );
};
