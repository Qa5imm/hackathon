import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as leaseRepository from "../../repository/lease";
import * as itemRepository from "../../repository/item";
import * as userRepository from "../../repository/user";

import { requireAuth } from "@/lib/middleware/auth";
import { item } from "@/lib/db/schema";


export interface Lease {
  id: string;
  itemId: string;
  lenderId: string;
  borrowerId: string;
  duration: number;
  totalAmount: number;
  created_at: Date;
  updated_at: Date;
}

const app = new Hono();

const createLeaseSchema = z.object({
  itemId: z.string(),
  duration: z.number().min(1),
});

const updateLeaseStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'completed', 'rejected'])
});

// Create lease
app.post("/", requireAuth, zValidator("json", createLeaseSchema), async (c) => {
  try{

  
  const data = c.req.valid("json");
  const session = c.get("session") as { userId: string };
  const borrowerDetails = await userRepository.findById(session.userId);
  const itemDetails= await itemRepository.findItemById(data.itemId);
  const lenderDetails= await itemRepository.findItemById(itemDetails?.userId || "");
 
  const totalAmount=  data.duration* (itemDetails?.coins || 0)
  if (borrowerDetails && itemDetails) {
  if ( borrowerDetails.coins < totalAmount){
    return c.json({ message: "Insufficient coins" }, 403);
  }
  else{

    
    const lenderId= lenderDetails?.id || ""
    const borrowerId= session.userId

    await userRepository.updateUserCoins(borrowerId, borrowerDetails.coins-totalAmount);
    await userRepository.updateUserCoins(lenderId, (lenderDetails?.coins || 0)+totalAmount);

    const lease = await leaseRepository.createLease({
      ...data,
      totalAmount,
      lenderId,
      borrowerId,
    });
  return c.json(lease, 201);

  }
}
  
  return c.json({ message: "Item or User not found" }, 404);
}catch(error){
    console.error("Error creating lease:", error);
    return c.json(
      {
        error: "An error occurred while creating lease",
      },
      500,
    );
  }

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