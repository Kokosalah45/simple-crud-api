import express from "express";

const productRouter = express.Router();

productRouter.get("/", (req, res) => {
  res.json({
    product: "koko",
  });
});
export default productRouter;
