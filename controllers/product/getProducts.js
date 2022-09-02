import prisma from "../../db/index.js";

export default async function getProducts(req, res) {
  const results = await prisma.product.findMany({
    select: {
      name: true,
      price: true,
      description: true,
    },
  });

  res.json({ results });
}
