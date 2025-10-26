import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || "https://warehouse-management-1-6uys.onrender.com:9094"], // Use Bitnami's EXTERNAL port
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
};

export const sendProductNotification = async (productName: string) => {
  const message = `🛒 Product "${productName}" was added by `;
  await producer.send({
    topic: 'product-events',
    messages: [{ value: message }],
  });
  console.log('📤 Kafka Message Sent:', message);
};

module.exports = { connectProducer, sendProductNotification };

