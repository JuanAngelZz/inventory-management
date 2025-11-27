import cron from 'node-cron'
import { performBackup } from './services/backup.service'

export const startCronJobs = () => {
  // Ejecutar respaldo todos los días a la medianoche (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Iniciando respaldo automático...')
    try {
      const filePath = await performBackup()
      console.log(`Respaldo automático completado: ${filePath}`)
    } catch (error) {
      console.error('Error en el respaldo automático:', error)
    }
  })
}
