import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from the server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const access = {
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'ims_upt',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 3306,
  charset: 'utf8mb4'
};

async function run() {
  console.log('Connecting to DB with:', { ...access, password: '***' });
  const conn = createPool(access);

  const query = 'mayonesa';
  const searchTerm = `%${query}%`;
  
  console.log(`Searching for: "${query}"`);
  console.log(`SQL Term: "${searchTerm}"`);

  try {
    const [rows]: any = await conn.query(
      'SELECT id, nombre, stock, precio_venta, descripcion FROM productos WHERE LOWER(nombre) LIKE LOWER(?) OR LOWER(descripcion) LIKE LOWER(?) LIMIT 10',
      [searchTerm, searchTerm]
    );

    console.log(`Found ${rows.length} products:`);
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await conn.end();
  }
}

run();
