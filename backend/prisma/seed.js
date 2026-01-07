import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const sampleProducts = [
  { name: "Coca-Cola", brand: "The Coca-Cola Company", category: "Beverage", country: "USA", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Boga" },
  { name: "Pepsi", brand: "PepsiCo", category: "Beverage", country: "USA", isBoycotted: true, reason: "Supports controversial policies", tunisianAlternative: "Boga" },
  { name: "McDonald's Big Mac", brand: "McDonald's", category: "Fast Food", country: "USA", isBoycotted: true, reason: "Franchise policy concerns", tunisianAlternative: "Local burger spots" },
  { name: "Nestlé Water", brand: "Nestlé", category: "Beverage", country: "Switzerland", isBoycotted: true, reason: "Water resource exploitation", tunisianAlternative: "Safia" },
  { name: "iPhone 15", brand: "Apple", category: "Electronics", country: "USA", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Harissa", brand: "Cap Bon", category: "Condiment", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Starbucks Coffee", brand: "Starbucks", category: "Beverage", country: "USA", isBoycotted: true, reason: "Controversial business practices", tunisianAlternative: "Café Local" },
  { name: "HP Laptop", brand: "HP", category: "Electronics", country: "USA", isBoycotted: true, reason: "Contracts with controversial entities", tunisianAlternative: "Lenovo" },
  { name: "Bimo Cookies", brand: "General Biscuits Tunisia", category: "Snacks", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" },
  { name: "Safia Water", brand: "SFBT", category: "Beverage", country: "Tunisia", isBoycotted: false, reason: "", tunisianAlternative: "" }
];

async function main() {
  console.log("🗑️  Clearing database...");
  await prisma.product.deleteMany();

  console.log("👤 Creating admin user...");
  await prisma.user.upsert({
    where: { email: "admin@consumesafe.tn" },
    update: {},
    create: {
      email: "admin@consumesafe.tn",
      password: await bcrypt.hash("Admin123!", 12),
      role: "ADMIN"
    }
  });

  console.log(`📦 Loading ${sampleProducts.length} products into database...`);
  
  for (const p of sampleProducts) {
    await prisma.product.create({
      data: p
    });
  }

  console.log("✅ Seed complete. المنتجات تم إدخالها بنجاح.");
  console.log(`✅ Admin user: admin@consumesafe.tn / Admin123!`);
  console.log(`✅ ${sampleProducts.length} products added to database.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
