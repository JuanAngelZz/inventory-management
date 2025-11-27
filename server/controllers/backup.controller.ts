import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

import { performBackup } from '../services/backup.service'

export const createBackup = async (req: Request, res: Response) => {
  let backupFilePath: string | null = null

  try {
    backupFilePath = await performBackup()

    // Descargar el respaldo
    res.download(backupFilePath, (err) => {
      if (err) {
        console.error(err)
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al descargar el respaldo' })
        }
      }
      // No eliminamos el archivo para mantener el historial
    })
  } catch (error) {
    console.error('Error al crear el respaldo:', error)
    if (backupFilePath && fs.existsSync(backupFilePath)) {
      fs.unlinkSync(backupFilePath)
    }
    res.status(500).json({ error: 'Error al crear el respaldo' })
  }
}

export const getBackups = (req: Request, res: Response) => {
  const backupDir = path.join(__dirname, '..', '..', 'backups')

  if (!fs.existsSync(backupDir)) {
    return res.json([])
  }

  try {
    const files = fs.readdirSync(backupDir)
    const backups = files
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const filePath = path.join(backupDir, file)
        const stats = fs.statSync(filePath)
        return {
          name: file,
          size: stats.size,
          date: stats.mtime
        }
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    res.json(backups)
  } catch (error) {
    console.error('Error al obtener el historial de respaldos:', error)
    res.status(500).json({ error: 'Error al obtener el historial' })
  }
}

export const downloadBackup = (req: Request, res: Response) => {
  const { filename } = req.params
  const backupFilePath = path.join(__dirname, '..', '..', 'backups', filename)

  if (!fs.existsSync(backupFilePath)) {
    return res.status(404).json({ error: 'Archivo de respaldo no encontrado' })
  }

  res.download(backupFilePath, (err) => {
    if (err) {
      console.error(err)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error al descargar el respaldo' })
      }
    }
  })
}
