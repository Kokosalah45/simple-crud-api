import prisma from "../../db/index.js";
import { Prisma } from "@prisma/client";
import { z, ZodError } from "zod";
import validateData from "../../utils/validate.js";

// {
//     "results": [
//         {
//             "id": 2,
//             "name": "COD BO3",
//             "price": 50.6,
//             "description": "this is a a fps shooter game made by activision",
//             "created_at": "2022-09-02T07:53:40.259Z",
//             "updated_at": "2022-09-02T07:53:40.259Z"
//         },
//         {
//             "id": 4,
//             "name": "PS5",
//             "price": 5500,
//             "description": "Gaming console from sony",
//             "created_at": "2022-09-02T09:40:44.352Z",
//             "updated_at": "2022-09-02T09:40:44.352Z"
//         }
//     ]
// }

const updateProductSchema = z.object({
  oldProductName: z
    .string({
      required_error: "old Name is required",
      invalid_type_error: "old Name must be a string",
    })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  productName: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),
  productPrice: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Number must be positive" })
    .optional(),
  productDescription: z.string().optional(),
});

export default async function updateProduct(req, res) {
  try {
    //this might throw an error
    const { oldProductName, productName, productPrice, productDescription } =
      await validateData(req.body, updateProductSchema);

    //this might throw an error
    const product = await prisma.product.update({
      where: {
        name: oldProductName,
      },
      data: {
        name: productName,
        price: productPrice,
        description: productDescription,
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
      if (e.code === "P2002") {
        response = {
          ...response,
          details: {
            DatabaseError:
              "There is a unique constraint violation, a new product cannot be updated with this name",
          },
        };
      }
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
