import { useUser } from "~/lib/hooks/user";
import { useNavigate } from "@remix-run/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { useBorrowerLeases } from "~/lib/hooks/lease";
import { LeaseCard } from "./lease-card";

export const BorrowedItems = () => {
  const navigate = useNavigate();
  const { data: user } = useUser(navigate);
  const { data: leases } = useBorrowerLeases(user?.id);

  if (!leases?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-2">no borrows yet</h3>
        <p className="text-gray-600">go find something cool to borrow!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {leases.map((lease) => (
        <LeaseCard key={lease.id} lease={lease} type="borrowed" />
      ))}
    </div>
  );
};
