import amqplib from "amqplib";
import dotenv from "dotenv";

dotenv.config();
export const publishToQueue = async (queue: string, message: string) => {
  const connection = await amqplib.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message));
  setTimeout(() => {
    connection.close();
  }, 500);
};
