import { useUser } from "~/lib/hooks/user";
import { AddItemDialog, EditItemDialog } from "./add-item-form";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useUpdateItem, useUserItems } from "~/lib/hooks/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UserItems } from "./user-items";
import { LeaseRequests } from "./lease-requests";
import { BorrowedItems } from "./user-leases";

export default function Dashboard() {
  const navigate = useNavigate();
  const userQuery = useUser(navigate);
  const userItemsQuery = useUserItems(userQuery.data?.id);

  useEffect(() => {
    if (!userQuery.isPending && !userQuery.data?.id) {
      navigate("/auth");
    }
  }, [userQuery.isPending, userQuery.data?.id, navigate]);

  if (userQuery.isLoading || userItemsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 p-4 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 p-4 flex items-start justify-center">
      <div className="container mx-auto flex flex-col gap-10">
        <div className="mt-8 flex justify-between items-center">
          <div className="font-mono">
            <div className="text-sm opacity-70">welcome back</div>
            <div className="text-3xl font-black">{userQuery.data?.name}</div>
          </div>
          <div className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-mono">
            <span className="text-yellow-400">⭐</span>
            <span className="font-bold">{userQuery.data?.coins || 0}</span>
          </div>
        </div>

        <div className="font-mono">
          <h2 className="text-2xl font-black mb-4">quick stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-4 border-black p-4 bg-purple-200 hover:bg-purple-300 transition-colors">
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm">items shared</div>
            </div>
            <div className="border-4 border-black p-4 bg-green-200 hover:bg-green-300 transition-colors">
              <div className="text-3xl font-bold">47</div>
              <div className="text-sm">total borrows</div>
            </div>
            <div className="border-4 border-black p-4 bg-blue-200 hover:bg-blue-300 transition-colors">
              <div className="text-3xl font-bold">96%</div>
              <div className="text-sm">return rate</div>
            </div>
            <div className="border-4 border-black p-4 bg-yellow-200 hover:bg-yellow-300 transition-colors">
              <div className="text-3xl font-bold">$1.2k</div>
              <div className="text-sm">saved by community</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">MY STASH</TabsTrigger>
            <TabsTrigger value="borrowed-items">THE GOODS</TabsTrigger>
            <TabsTrigger value="lease-requests">THE PLUG</TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <UserItems />
          </TabsContent>
          <TabsContent value="borrowed-items">
            <BorrowedItems />
          </TabsContent>
          <TabsContent value="lease-requests">
            <LeaseRequests />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
