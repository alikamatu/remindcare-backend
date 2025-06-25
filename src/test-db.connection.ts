import 'dotenv/config'; // Add this line at the very top
import { DataSource } from 'typeorm';

// ...existing code...

async function testConnection() {
  console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
  console.log('DB_PASSWORD value:', process.env.DB_PASSWORD ? '***set***' : '***not set***');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  await dataSource.initialize();
  console.log('✅ Neon connection successful!');
  await dataSource.destroy();
}

testConnection().catch((err) => {
  console.error('❌ Neon connection failed:', err);
  process.exit(1);
});