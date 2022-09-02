import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "vatika",
    price: 400.6,
    description: "this is a hair shampoo",
  },
  {
    name: "COD BO3",
    price: 50.6,
    description: "this is a a fps shooter game made by activision",
  },
];

const insertProducts = async () => {
  await prisma.product.createMany({ data: products });
};

insertProducts()
  .catch((e) => {
    console.log(e.message);
    process.exit();
  })
  .finally(() => {
    prisma.$disconnect();
  });
