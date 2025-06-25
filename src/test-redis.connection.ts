import { Queue } from 'bullmq';
import 'dotenv/config';

async function testRedis() {
  const queue = new Queue('test', {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
      password: process.env.REDIS_PASSWORD,
    },
  });
  await queue.add('test-job', { data: 'ping' });
  console.log('✅ Redis job queued successfully!');
}
testRedis().catch((err) => {
  console.error('❌ Redis connection failed:', err);
  process.exit(1);
});