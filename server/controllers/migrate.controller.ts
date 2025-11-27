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

import { spawn } from 'child_process'
import { createReadStream } from 'fs'
import { DB_USER, DB_PASSWORD, DB_NAME } from '../config'

export const restoreBackup = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó ningún archivo' })
  }

  const filePath = req.file.path

  try {
    // 1. Limpiar la base de datos actual antes de restaurar
    const connection = await pool.getConnection()
    try {
      await connection.query('SET FOREIGN_KEY_CHECKS = 0')
      const [rows] = (await connection.query('SHOW TABLES')) as any[]
      if (rows.length > 0) {
        for (const row of rows) {
          const tableName = Object.values(row)[0]
          await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``)
        }
      }
      await connection.query('SET FOREIGN_KEY_CHECKS = 1')
    } finally {
      connection.release()
    }

    // 2. Usar docker exec para restaurar la base de datos
    // Esto evita problemas de parsing de SQL en Node.js y problemas de encoding
    const child = spawn('docker', [
      'exec',
      '-i',
      'mysql-ims',
      'mysql',
      `-u${DB_USER}`,
      `-p${DB_PASSWORD}`,
      DB_NAME
    ])

    const fileStream = createReadStream(filePath)
    
    fileStream.pipe(child.stdin)

    child.stdin.on('error', (err) => {
      console.error('Error en stdin de docker:', err)
    })

    child.on('error', (err) => {
      console.error('Error al ejecutar docker:', err)
      res.status(500).json({ error: 'Error al ejecutar el proceso de restauración' })
    })

    child.stderr.on('data', (data) => {
      console.error(`Docker stderr: ${data}`)
    })

    child.on('close', async (code) => {
      // Eliminar archivo temporal
      try {
        await fs.unlink(filePath)
      } catch (e) {
        console.error('Error al eliminar archivo temporal:', e)
      }

      if (code === 0) {
        res.json({ message: 'Base de datos restaurada exitosamente' })
      } else {
        console.error(`Proceso de restauración terminó con código ${code}`)
        res.status(500).json({ error: 'Error al restaurar la base de datos' })
      }
    })

  } catch (error) {
    console.error('Error al restaurar la base de datos:', error)
    try {
      await fs.unlink(filePath)
    } catch (e) {
      console.error('Error al eliminar archivo temporal:', e)
    }
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al restaurar la base de datos' })
    }
  }
}
