import { Router } from 'express'
import { getReportData } from '../controllers/report.controller'

const router = Router()

router.get('/report', getReportData)

export default router
