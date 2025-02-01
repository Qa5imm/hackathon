import { useUser } from "~/lib/hooks/user";
import { useParams, useNavigate } from "@remix-run/react";
import { motion, AnimatePresence } from "motion/react";
import { useUserItems } from "~/lib/hooks/item";
import { Award, TrendingUp, Coins, Package } from "lucide-react";
import axios from "axios";

// move this to your items api file fr fr
const getItems = (userId: string) =>
  axios.get(`/api/users/${userId}/items`).then((res) => res.data);

export default function UserProfile() {
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser(navigate);

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = useUserItems(user?.id);

  if (userLoading || itemsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="relative">
            <img
              src={user.avatar || "default-avatar.png"}
              className="h-24 w-24 rounded-full border-4 border-purple-500 object-cover"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2"
            >
              <Award className="text-xl text-white" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="text-2xl text-purple-500" />
              <h2 className="text-xl font-semibold text-white">Trust Score</h2>
            </div>
            <div className="mt-4">
              <div className="relative h-4 rounded-full bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.trustScore}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {user.trustScore}%
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <Coins className="text-2xl text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Coins</h2>
            </div>
            <p className="mt-4 text-3xl font-bold text-yellow-500">
              {user.coins.toLocaleString()}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 rounded-xl bg-gray-800/50 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Package className="text-2xl text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Active Items</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {items?.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-4 rounded-lg bg-gray-700/50 p-4"
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-3">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!items?.length && (
              <p className="text-gray-500">no items yet bestie</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
