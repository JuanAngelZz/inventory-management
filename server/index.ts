import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { PORT } from './config'
import { startCronJobs } from './cron'

startCronJobs()

import conn from './db'

const startServer = async () => {
  let retries = 5
  while (retries) {
    try {
      await conn.query('SELECT 1')
      console.log('Database connected successfully')
      break
    } catch (error) {
      console.log('Database not ready, retrying in 5 seconds...')
      retries -= 1
      await new Promise(res => setTimeout(res, 5000))
    }
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

import alertRoutes from './routes/alert.routes'
app.use('/api/alerts', alertRoutes)

startServer()
