import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  /* ------------------ CATEGORIES ------------------ */
  const categories = await prisma.category.createMany({
    data: [
      { name: "Electronics", slug: "electronics" },
      { name: "Clothing", slug: "clothing" },
      { name: "Home & Kitchen", slug: "home-kitchen" },
    ],
    skipDuplicates: true,
  });

  const [electronics, clothing, home] = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  /* ------------------ PRODUCTS ------------------ */
  const products = await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15",
        description: "Apple iPhone 15 with A16 Bionic chip",
        price: 79999,
        categoryId: electronics.id,
      },
      {
        name: "Noise Smartwatch",
        description: "AMOLED display, fitness & health tracking",
        price: 4999,
        categoryId: electronics.id,
      },
      {
        name: "Bluetooth Headphones",
        description: "Wireless headphones with noise cancellation",
        price: 2999,
        categoryId: electronics.id,
      },
      {
        name: "Cotton T-Shirt",
        description: "100% cotton, regular fit",
        price: 999,
        categoryId: clothing.id,
      },
      {
        name: "Denim Jeans",
        description: "Slim fit blue denim jeans",
        price: 1999,
        categoryId: clothing.id,
      },
      {
        name: "Non-Stick Frying Pan",
        description: "Durable non-stick cookware",
        price: 1499,
        categoryId: home.id,
      },
      {
        name: "Electric Kettle",
        description: "1.5L fast boiling electric kettle",
        price: 1799,
        categoryId: home.id,
      },
    ],
    skipDuplicates: true,
  });

  const allProducts = await prisma.product.findMany();

  /* ------------------ INVENTORY ------------------ */
  for (const product of allProducts) {
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        stockQuantity: Math.floor(Math.random() * 50) + 10, // 10–60
        lowStockThreshold: 5,
      },
    });
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
