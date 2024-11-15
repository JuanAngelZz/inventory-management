import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import mysqldump from 'mysqldump'

export const createBackup = (req: Request, res: Response) => {
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
  mysqldump({
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ims_upt'
    },
    dumpToFile: backupFilePath
  })

  // Descargar el respaldo
  res.download(backupFilePath, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al crear el respaldo' })
    }
    fs.unlinkSync(backupFilePath)
  })
}
