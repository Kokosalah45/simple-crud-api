import prisma from "../../db/index.js";
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
    const { code } = e;
    if (e instanceof ZodError) {
      res.json({ e, success: false });
    }
    if (code === "P2025") {
      res.json({
        details: "Record to delete does not exist",
        success: false,
      });
    }
  }
}
