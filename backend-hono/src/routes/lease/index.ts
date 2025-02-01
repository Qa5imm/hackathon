import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as leaseRepository from "../../repository/lease";
import { requireAuth } from "@/lib/middleware/auth";

const app = new Hono();

const createLeaseSchema = z.object({
  lenderId: z.string(),
  itemId: z.string(),
  duration: z.number().min(1),
  totalAmount: z.number().min(0),
});

const updateLeaseStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'completed', 'rejected'])
});

// Create lease
app.post("/", requireAuth, zValidator("json", createLeaseSchema), async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session") as { userId: string };
  
  const lease = await leaseRepository.createLease({
    ...data,
    borrowerId: session.userId,
  });

  return c.json(lease, 201);
});

// Update lease status
app.patch("/:id/status", requireAuth, zValidator("json", updateLeaseStatusSchema), async (c) => {
  const id = c.req.param("id");
  const { status } = c.req.valid("json");
  
  const lease = await leaseRepository.updateLeaseStatus(id, status);
  return c.json(lease);
});

// Get lease by id
app.get("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const lease = await leaseRepository.findLeaseById(id);
  
  if (!lease) {
    return c.json({ message: "Lease not found" }, 404);
  }
  
  return c.json(lease);
});

// Get all leases
app.get("/", requireAuth, async (c) => {
  const leases = await leaseRepository.findAllLeases();
  return c.json(leases);
});

// Get leases by lender
app.get("/lender/:lenderId", requireAuth, async (c) => {
  const lenderId = c.req.param("lenderId");
  const leases = await leaseRepository.findLeasesByLenderId(lenderId);
  return c.json(leases);
});

// Get leases by borrower
app.get("/borrower/:borrowerId", requireAuth, async (c) => {
  const borrowerId = c.req.param("borrowerId");
  const leases = await leaseRepository.findLeasesByBorrowerId(borrowerId);
  return c.json(leases);
});


export const leaseRouter = app;