import { Router } from 'express'
import { seed } from '../controllers/seed.controller'

const router = Router()

router.get('/seed', seed)

export default router
