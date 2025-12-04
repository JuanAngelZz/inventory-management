import { Router } from 'express'
import { triggerAlerts } from '../controllers/alert.controller'

const router = Router()

router.post('/test', triggerAlerts)

export default router
