import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3306", 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Product],
  migrations: [],
  subscribers: [],
});
