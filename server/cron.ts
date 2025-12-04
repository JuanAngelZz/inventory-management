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

  // Ejecutar verificación de alertas todos los días a las 8:00 PM (20:00)
  cron.schedule('0 20 * * *', async () => {
    console.log('Iniciando verificación de alertas...')
    try {
      await checkAndSendAlerts()
      console.log('Verificación de alertas completada')
    } catch (error) {
      console.error('Error en la verificación de alertas:', error)
    }
  })
}

import { checkAndSendAlerts } from './controllers/alert.controller'

