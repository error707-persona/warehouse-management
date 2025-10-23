import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'notification-listener',
  brokers: ['localhost:9094'],
});

const consumer = kafka.consumer({ groupId: 'notif-group' });

export const startConsumer = async (onMessage: (msg: string) => void) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'product-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const msg = message.value?.toString() || '';
      console.log('📥 Received:', msg);
      onMessage(msg);
    },
  });
};
