import express from "express";
import { connectMongo } from "./mongo";
import { consumeQueue } from "./rabbitmq";

connectMongo()
  .then(() => {
    const app = express();
    app.use(express.json());

    consumeQueue();

    app.listen(4000, () => {
      console.log("Consumer service running on port 4000");
    });
  })
  .catch((error) => console.log(error));
