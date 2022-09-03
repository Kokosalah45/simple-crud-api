import express from "express";
import { apiRouter } from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({
    routes: {
      api: {
        baseUrl: "http://127.0.0.1:5000/api",
        routes: {
          product: {
            baseUrl: `http://127.0.0.1:5000/api/product`,
            routes: {},
          },
        },
      },
    },
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("we listenin baby");
});
