import { Router } from 'express'
import { migrate } from '../controllers/migrate.controller'

const router = Router()

router.get('/migrate', migrate)

export default router
