import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { PORT } from './config'
import { startCronJobs } from './cron'

startCronJobs()

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
