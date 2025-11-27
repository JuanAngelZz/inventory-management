import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { migrate, restoreBackup } from '../controllers/migrate.controller'

const router = Router()
const upload = multer({ dest: path.join(__dirname, '../../uploads/') })

router.get('/migrate', migrate)
router.post('/restore', upload.single('backup'), restoreBackup)

export default router
