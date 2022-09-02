import express from "express";
import productRouter from "./product-router.js";

const apiRouter = express.Router();
apiRouter.use("/product", productRouter);

apiRouter.get("/", (req, res) => {
  res.send("HI API !");
});
export default apiRouter;
