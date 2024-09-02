import { Router } from "express";
import { AppDataSource } from "../ormconfig";
import { Product } from "../entity/Product";
import { publishToQueue } from "../rabbitmq";

const router = Router();
const productRepository = AppDataSource.getRepository(Product);

router.post("/", async (req, res) => {
  const { name, price } = req.body;
  const product = new Product(name, price);
  product.name = name;
  product.price = price;

  await productRepository.save(product);

  publishToQueue("product_queue", JSON.stringify(product));

  res.status(201).send(product);
});

router.get("/", async (req, res) => {
  const products = await productRepository.find();
  res.status(200).send(products);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  let product = await productRepository.findOneBy({ id: parseInt(id) });
  if (product) {
    product.name = name;
    product.price = price;
    await productRepository.save(product);

    publishToQueue("product_queue", JSON.stringify(product));

    res.status(200).send(product);
  } else {
    res.status(404).send("Product not found");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await productRepository.delete(id);

  if (result.affected) {
    publishToQueue("product_delete_queue", JSON.stringify({ id }));

    res.status(200).send({ message: "Product deleted" });
  } else {
    res.status(404).send("Product not found");
  }
});

export default router;
