import express from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const ProductSchema = z.object({
  name: z.string().min(2).max(120),
  brand: z.string().max(120).optional().default(""),
  category: z.string().max(120).optional().default(""),
  country: z.string().max(120).optional().default(""),
  isBoycotted: z.union([z.boolean(), z.number()]).optional().default(false),
  reason: z.string().max(500).optional().default(""),
  tunisianAlternative: z.string().max(200).optional().default("")
});

router.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    if (!q) return res.json([]);
    
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } }
        ]
      },
      orderBy: [
        { isBoycotted: "desc" },
        { name: "asc" }
      ]
    });
    
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.post("/", auth, adminOnly, async (req, res, next) => {
  try {
    const parsed = ProductSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    }

    const p = parsed.data;
    const product = await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        category: p.category,
        country: p.country,
        isBoycotted: !!p.isBoycotted,
        reason: p.reason,
        tunisianAlternative: p.tunisianAlternative
      }
    });
    
    // Security audit log
    console.log(`[AUDIT] ${new Date().toISOString()} - Product added: "${p.name}" (ID: ${product.id}) by ${req.user.email} from IP: ${req.ip}`);
    
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/toggle", auth, adminOnly, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({ error: "not found" });
    }
    
    const updated = await prisma.product.update({
      where: { id },
      data: { isBoycotted: !product.isBoycotted }
    });
    
    // Security audit log
    console.log(`[AUDIT] ${new Date().toISOString()} - Product ${id} boycott status toggled to ${!product.isBoycotted} by ${req.user.email} from IP: ${req.ip}`);
    
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

export default router;
