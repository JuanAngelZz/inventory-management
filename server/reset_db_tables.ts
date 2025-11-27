import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } from './config'

const resetDb = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(DB_PORT),
    multipleStatements: true
  })

  try {
    const sql = fs.readFileSync(path.join(__dirname, '../create_tables.sql'), 'utf-8')
    
    // Split queries by semicolon, but handle empty lines
    const queries = sql.split(';').filter(query => query.trim() !== '')

    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query)
      }
    }

    console.log('Tablas creadas exitosamente.')
  } catch (error) {
    console.error('Error al crear tablas:', error)
  } finally {
    await connection.end()
  }
}

resetDb()
