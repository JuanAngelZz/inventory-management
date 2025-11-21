import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import userRouter from './routes/user.routes'
import categoryRouter from './routes/category.routes'
import productRouter from './routes/product.routes'
import movementRouter from './routes/movement.routes'
import supplierRouter from './routes/supplier.routes'
import carrierCodeRouter from './routes/carrierCode.routes'
import backupRouter from './routes/backup.routes'
import chatRouter from './routes/chat.routes'
import migrateRouter from './routes/migrate.routes'
import seedRouter from './routes/seed.routes'

const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(morgan('dev'))

app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', movementRouter)
app.use('/api', supplierRouter)
app.use('/api', carrierCodeRouter)
app.use('/api', backupRouter)
app.use('/api', chatRouter)
app.use('/api', migrateRouter)
app.use('/api', seedRouter)

export default app
