import amqplib from "amqplib";
import { productCollection } from "./mongo";
import dotenv from "dotenv";

dotenv.config();

export const consumeQueue = async () => {
  try {
    const connection = await amqplib.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    const channel = await connection.createChannel();
    await channel.assertQueue("product_queue", { durable: true });
    await channel.assertQueue("product_delete_queue", { durable: true });

    // Function to handle messages from the product_queue
    const handleProductQueueMessage = async (
      msg: amqplib.ConsumeMessage | null
    ) => {
      if (msg === null) {
        console.error("Received null message from product_queue.");
        return;
      }

      try {
        const product = JSON.parse(msg.content.toString());
        console.log("consume product_queue: ", product);
        if (product.id) {
          await productCollection.updateOne(
            { id: product.id },
            { $set: product },
            { upsert: true }
          );
          console.log(
            `Product with ID ${product.id} has been updated/inserted.`
          );
        } else {
          console.error("No ID found in the product data:", product);
          // Optionally, send to a dead-letter queue or log for manual review
        }
      } catch (err) {
        console.error("Error processing product_queue message:", err);
        // Optionally, send to a dead-letter queue or log for manual review
      } finally {
        channel.ack(msg);
      }
    };

    // Function to handle messages from the product_delete_queue
    const handleProductDeleteQueueMessage = async (
      msg: amqplib.ConsumeMessage | null
    ) => {
      if (msg === null) {
        console.error("Received null message from product_delete_queue.");
        return;
      }

      try {
        const product = JSON.parse(msg.content.toString());
        console.log("consume product_delete_queue: ", product);

        const existingProduct = await productCollection.findOne({
          id: Number(product.id),
        });
        console.log("existingProduct: ", existingProduct);

        if (product.id) {
          await productCollection.deleteOne({ id: Number(product.id) });
          console.log(`Product with ID ${product.id} has been deleted.`);
        } else {
          console.error("No ID found in the delete product data:", product);
          // Optionally, send to a dead-letter queue or log for manual review
        }
      } catch (err) {
        console.error("Error processing product_delete_queue message:", err);
        // Optionally, send to a dead-letter queue or log for manual review
      } finally {
        channel.ack(msg);
      }
    };

    // Consume messages from the product_queue
    channel.consume("product_queue", handleProductQueueMessage);

    // Consume messages from the product_delete_queue
    channel.consume("product_delete_queue", handleProductDeleteQueueMessage);

    console.log("Listening to product_queue and product_delete_queue...");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ or create channel:", err);
  }
};
