import { Request, Response } from 'express'
import pool from '../db'
import fs from 'fs/promises'
import path from 'path'

export const migrate = async (req: Request, res: Response) => {
  try {
    const [rows] = (await pool.query('SHOW TABLES')) as any[]

    if (rows.length > 0) {
      await pool.query('SET FOREIGN_KEY_CHECKS = 0')
      for (const row of rows) {
        const tableName = Object.values(row)[0]
        await pool.query(`DROP TABLE IF EXISTS \`${tableName}\``)
      }
      await pool.query('SET FOREIGN_KEY_CHECKS = 1')
    }

    const sql = await fs.readFile(
      path.join(__dirname, '../../create_tables.sql'),
      'utf-8'
    )
    const queries = sql.split(';').filter(query => query.trim() !== '')

    for (const query of queries) {
      await pool.query(query)
    }

    res.status(200).json({ message: 'Database migrated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error migrating database' })
  }
}
