import express from "express";
import { productRouter } from "./index.js";

const apiRouter = express.Router();

apiRouter.use("/products", productRouter);

apiRouter.get("/", (req, res) => {
  res.send("HI API !");
});
export default apiRouter;
