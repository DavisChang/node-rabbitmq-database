import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client = new MongoClient(url);

export const db = client.db("product_db");
export const productCollection = db.collection("products");

export const connectMongo = async () => {
  await client.connect();
  console.log("Connected to MongoDB");
};
