import { useUser } from "~/lib/hooks/user";
import { useNavigate } from "@remix-run/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  useLenderLeases,
  useBorrowerLeases,
  useUpdateLeaseStatus,
} from "~/lib/hooks/lease";
import { LeaseCard } from "./lease-card";

export const LeaseRequests = () => {
  const navigate = useNavigate();
  const { data: user } = useUser(navigate);
  const { data: leases } = useLenderLeases(user?.id);

  if (!leases?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-2">no requests yet</h3>
        <p className="text-gray-600">
          when people want to borrow ur stuff, they'll show up here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {leases.map((lease) => (
        <LeaseCard key={lease.lease.id} lease={lease.lease} type="request" />
      ))}
    </div>
  );
};
