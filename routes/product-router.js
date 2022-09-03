import express from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/product/index.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.delete("/", deleteProduct);
productRouter.put("/", updateProduct);

export default productRouter;
