import { Router } from 'express'
import { validateToken } from '../middlewares/validateToken'
import { createBackup } from '../controllers/backup.controller'

const router = Router()

router.post('/backup', validateToken, createBackup)

export default router
