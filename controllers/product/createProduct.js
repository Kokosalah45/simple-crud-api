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

const createProductSchema = z.object({
  productName: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  productPrice: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Number must be positive" }),
  productDescription: z.string(),
});

export default async function createProduct(req, res) {
  try {
    //this might throw an error
    const { productName, productPrice, productDescription } =
      await validateData(req.body, createProductSchema);

    //this might throw an error
    const product = await prisma.product.create({
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
              "There is a unique constraint violation, a new product cannot be created with this name",
          },
        };
      }
    }
    res.json(response);
  }
}
