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
import { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } from '../config'

export const restoreBackup = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó ningún archivo' })
  }

  const filePath = req.file.path
  let responseSent = false

  const sendResponse = (code: number, body: any) => {
    if (!responseSent) {
      responseSent = true
      res.status(code).json(body)
    }
  }

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

      // Asegurar que el usuario tenga el plugin de autenticación correcto
      // Esto es necesario porque el cliente de mariadb en alpine no soporta caching_sha2_password por defecto
      await connection.query(`ALTER USER '${DB_USER}'@'%' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';`)
      await connection.query('FLUSH PRIVILEGES;')
    } finally {
      connection.release()
    }

    // 2. Usar mysql client para restaurar la base de datos
    // Se conecta al host definido en DB_HOST
    // Usamos --skip-ssl para evitar errores de certificado self-signed
    // Usamos --get-server-public-key para permitir autenticación sha2 sin SSL
    const args = [
      `-h${DB_HOST}`,
      `-u${DB_USER}`,
      `-p${DB_PASSWORD}`,
      '--skip-ssl',
      DB_NAME
    ]
    console.log('INTENTO DE RESTAURACION (FIX FLAG): Ejecutando mysql con argumentos:', args.map(a => a.startsWith('-p') ? '-p*****' : a))

    const child = spawn('mysql', args)

    const fileStream = createReadStream(filePath)

    fileStream.pipe(child.stdin)

    child.stdin.on('error', (err) => {
      console.error('Error en stdin de mysql:', err)
      // No enviamos respuesta aquí, dejamos que el proceso falle y maneje el error en 'close' o 'error' del proceso
    })

    child.on('error', (err) => {
      console.error('Error al ejecutar mysql:', err)
      sendResponse(500, { error: 'Error al ejecutar el proceso de restauración' })
    })

    child.stderr.on('data', (data) => {
      const message = data.toString()
      // Ignorar advertencia de deprecación
      if (!message.includes('Deprecated program name')) {
        console.error(`Mysql stderr: ${message}`)
      }
    })

    child.on('close', async (code) => {
      // Eliminar archivo temporal
      try {
        await fs.unlink(filePath)
      } catch (e) {
        console.error('Error al eliminar archivo temporal:', e)
      }

      if (code === 0) {
        sendResponse(200, { message: 'Base de datos restaurada exitosamente' })
      } else {
        console.error(`Proceso de restauración terminó con código ${code}`)
        sendResponse(500, { error: 'Error al restaurar la base de datos' })
      }
    })

  } catch (error) {
    console.error('Error al restaurar la base de datos:', error)
    try {
      await fs.unlink(filePath)
    } catch (e) {
      console.error('Error al eliminar archivo temporal:', e)
    }
    sendResponse(500, { error: 'Error al restaurar la base de datos' })
  }
}
