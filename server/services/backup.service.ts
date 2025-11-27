import path from 'path'
import fs from 'fs'
import mysqldump from 'mysqldump'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } from '../config'

export const performBackup = async (): Promise<string> => {
  const backupFilePath = path.join(
    __dirname,
    '..',
    '..',
    'backups',
    `backup_${Date.now()}.sql`
  )

  // Crear el directorio 'backups' si no existe
  const backupDir = path.join(__dirname, '..', '..', 'backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  // Realizar el respaldo utilizando mysqldump
  await mysqldump({
    connection: {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: Number(DB_PORT)
    },
    dumpToFile: backupFilePath,
    dump: {
      schema: {
        table: {
          dropIfExist: true
        }
      }
    }
  })

  return backupFilePath
}
