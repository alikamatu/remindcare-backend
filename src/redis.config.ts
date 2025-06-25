import Queue from 'bull';

export const reminderQueue = new Queue('reminders', {
  redis: {
    host: 'your-redis-endpoint.cache.amazonaws.com',
    port: 6379,
    tls: {}, // Required for ElastiCache
  },
});