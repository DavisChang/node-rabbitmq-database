import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormconfig";
import productRouter from "./routes/product";

AppDataSource.initialize()
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use("/products", productRouter);

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.log(error));
