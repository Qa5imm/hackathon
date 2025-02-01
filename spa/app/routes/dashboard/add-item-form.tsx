import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const itemSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters"),
  description: z.string().min(10, "description must be at least 10 characters"),
  category: z.enum([
    "electronics",
    "clothing",
    "books",
    "sports",
    "tools",
    "other",
  ]),
  image: z.string().optional(),
  coins: z.number().min(0).default(0),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
  onSubmit: (data: ItemFormData) => Promise<void>;
  defaultValues?: Partial<ItemFormData>;
  submitButtonText: string;
  loadingText: string;
}

function ItemForm({
  onSubmit,
  defaultValues,
  submitButtonText,
  loadingText,
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      coins: 0,
      ...defaultValues,
    },
  });

  const imageFile = watch("image")?.[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* Name Input */}
      <div>
        <label className="block font-mono mb-2" htmlFor="name">
          name *
        </label>
        <input
          {...register("name")}
          className="w-full px-4 py-2 border-4 border-black font-mono bg-white"
          placeholder="what're you sharing?"
        />
        {errors.name && (
          <p className="text-red-500 text-sm font-mono mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label className="block font-mono mb-2" htmlFor="description">
          description *
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-4 py-2 border-4 border-black font-mono bg-white"
          placeholder="tell us about it..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm font-mono mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category Select */}
      <div>
        <label className="block font-mono mb-2" htmlFor="category">
          category *
        </label>
        <select
          {...register("category")}
          className="w-full px-4 py-2 border-4 border-black font-mono bg-white"
        >
          <option value="">select a category</option>
          <option value="electronics">electronics</option>
          <option value="clothing">clothing</option>
          <option value="books">books</option>
          <option value="sports">sports</option>
          <option value="tools">tools</option>
          <option value="other">other</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm font-mono mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-mono mb-2" htmlFor="image">
          image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="w-full px-4 py-2 border-4 border-black font-mono bg-white"
        />
        {imageFile && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-32 h-32 object-cover border-4 border-black"
            />
          </div>
        )}
      </div>

      {/* Coins Input */}
      <div>
        <label className="block font-mono mb-2" htmlFor="coins">
          coins per day
        </label>
        <input
          type="number"
          {...register("coins", { valueAsNumber: true })}
          className="w-full px-4 py-2 border-4 border-black font-mono bg-white"
          placeholder="0"
        />
        {errors.coins && (
          <p className="text-red-500 text-sm font-mono mt-1">
            {errors.coins.message}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transform hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? loadingText : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export function AddItemDialog() {
  const onSubmit = async (data: ItemFormData) => {
    try {
      let imageUrl = "";
      if (data.image?.[0]) {
        // upload image logic here
      }

      const itemData = {
        ...data,
        image: imageUrl,
        status: "listed" as const,
      };

      console.log(itemData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transform hover:-translate-y-1 transition">
          + ADD NEW ITEM
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-4 border-black [box-shadow:8px_8px_0_0_#000]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black transform -rotate-1">
            add new item
          </DialogTitle>
          <p className="font-mono">share ur stuff with the community fr fr</p>
        </DialogHeader>

        <ItemForm
          onSubmit={onSubmit}
          submitButtonText="ADD ITEM →"
          loadingText="adding..."
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditItemDialog({ item }: { item: ItemFormData }) {
  const onSubmit = async (data: ItemFormData) => {
    try {
      let imageUrl = "";
      if (data.image?.[0]) {
        // upload image logic here
      }

      const itemData = {
        ...data,
        image: imageUrl,
        status: "listed" as const,
      };

      console.log(itemData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transform hover:-translate-y-1 transition">
          EDIT ITEM
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-4 border-black [box-shadow:8px_8px_0_0_#000]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black transform -rotate-1">
            edit item
          </DialogTitle>
          <p className="font-mono">update your item details</p>
        </DialogHeader>

        <ItemForm
          onSubmit={onSubmit}
          defaultValues={item}
          submitButtonText="UPDATE ITEM →"
          loadingText="updating..."
        />
      </DialogContent>
    </Dialog>
  );
}
