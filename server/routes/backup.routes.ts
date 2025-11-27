import { Router } from 'express'
import { validateToken } from '../middlewares/validateToken'
import { createBackup, downloadBackup, getBackups } from '../controllers/backup.controller'

const router = Router()

router.post('/backup', validateToken, createBackup)
router.get('/backups', validateToken, getBackups)
router.get('/backup/:filename', validateToken, downloadBackup)

export default router
