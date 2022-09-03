import prisma from "../../db/index.js";
import { Prisma } from "@prisma/client";
import { z, ZodError } from "zod";
import validateData from "../../utils/validate.js";

const deleteProductSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
});
export default async function deleteProduct(req, res) {
  try {
    const { name } = await validateData(req.body, deleteProductSchema);

    const product = await prisma.product.delete({
      where: {
        name,
      },
    });
    res.json({ success: true, product });
  } catch (e) {
    let response = { success: false, details: null };
    if (e instanceof ZodError) {
      response = { ...response, details: { userInputError: e.flatten() } };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner

      if (e.code === "P2025") {
        response = {
          ...response,
          details: { DatabaseError: "Record Does not exist" },
        };
      }
    }
    res.json(response);
  }
}
