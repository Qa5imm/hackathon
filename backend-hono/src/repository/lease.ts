import { db } from "../lib/db";
import { lease } from "@/lib/db/schema";
import { eq, and, InferInsertModel, InferSelectModel } from "drizzle-orm";

type Lease = InferSelectModel<typeof leases>;
type NewLease = InferInsertModel<typeof leases>;

type LeaseStatus = 'pending' | 'active' | 'completed'; 

interface CreateLease {
  item_id: string;
  lender_id: string;
  borrower_id: string;
  duration: number;
  total_amount: number;
}

interface UpdateLease {
  status: LeaseStatus;
}

export const createLease = async (data: CreateLease): Promise<Lease> => {
  const [lease] = await db
    .insert(leases)
    .values({
      id: nanoid(),
      ...data,
      status: 'pending',
    })
    .returning();

  if (!lease) {
    throw new Error("Failed to create lease");
  }

  return lease;
};

export const updateLeaseStatus = async (id: string, status: LeaseStatus): Promise<Lease> => {
  const [updated] = await db
    .update(leases)
    .set({ 
      status,
      updated_at: new Date()
    })
    .where(eq(leases.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update lease");
  }

  return updated;
};

export const findLeaseById = async (id: string): Promise<Lease | undefined> => {
  const [lease] = await db
    .select()
    .from(leases)
    .where(eq(leases.id, id))
    .limit(1);

  return lease;
};

export const findAllLeases = async (): Promise<Lease[]> => {
  return await db
    .select()
    .from(leases)
    .orderBy(leases.created_at);
};

export const findLeasesByLenderId = async (lender_id: string): Promise<Lease[]> => {
  return await db
    .select()
    .from(leases)
    .where(eq(leases.lender_id, lender_id))
    .orderBy(leases.created_at);
};

export const findLeasesByBorrowerId = async (borrower_id: string): Promise<Lease[]> => {
  return await db
    .select()
    .from(leases)
    .where(eq(leases.borrower_id, borrower_id))
    .orderBy(leases.created_at);
};

export const findLeasesByItemId = async (item_id: string): Promise<Lease[]> => {
  return await db
    .select()
    .from(leases)
    .where(eq(leases.item_id, item_id))
    .orderBy(leases.created_at);
};u