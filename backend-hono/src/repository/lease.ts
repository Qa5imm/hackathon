import { db } from "../lib/db";
import { lease, leasetatus } from "@/lib/db/schema";
import { eq, and, InferInsertModel, InferSelectModel, ne } from "drizzle-orm";

type LeaseStatus = 'pending' | 'active' | 'completed' | 'rejected'; 
interface CreateLease {
  itemId: string;
  lenderId: string;
  borrowerId: string;
  duration: number;
  totalAmount: number;
}

export const createLease = async (data: CreateLease) => {
  const [created_lease] = await db
    .insert(lease)
    .values({
        ...data,
        status: 'pending',
      })
    .$returningId()

  if (!created_lease) {
    throw new Error("Failed to create lease");
  }

  return created_lease;
};

export const updateLeaseStatus = async (id: string, status: LeaseStatus) => {
  const [updated_lease] = await db
    .update(lease)
    .set({ 
      status,
      updated_at: new Date()
    })
    .where(eq(lease.id, id))

  if (!updated_lease) {
    throw new Error("Failed to update lease");
  }

  return updated_lease;
};

export const findLeaseById = async (id: string) => {
  const [found_lease] = await db
    .select()
    .from(lease)
    .where(eq(lease.id, id))
    .limit(1);

  return found_lease;
};

export const findAllLeases = async () => {
  return await db
    .select()
    .from(lease)
    .orderBy(lease.created_at);
};

export const findLeasesByLenderId = async (lenderId: string) => {
  return await db
    .select()
    .from(lease)
    .where(eq(lease.lenderId, lenderId))
    .orderBy(lease.created_at);
};

export const findLeasesByBorrowerId = async (borrowerId: string) => {
  return await db
    .select()
    .from(lease)
    .where(eq(lease.borrowerId, borrowerId))
    .orderBy(lease.created_at);
};

export const findLeasesByItemId = async (itemId: string) => {
  return await db
    .select()
    .from(lease)
    .where(eq(lease.itemId, itemId))
    .orderBy(lease.created_at);
};

export const updateOtherLeasesStatus = async (
  currentLeaseId: string,
  itemId: string,
  status: LeaseStatus
): Promise<number> => {
  const result = await db
    .update(lease)
    .set({ 
      status,
      updated_at: new Date() 
    })
    .where(
      and(
        eq(lease.itemId, itemId),
        ne(lease.id, currentLeaseId),
        eq(lease.status, 'pending')
      )
    );

  return result.length;
};