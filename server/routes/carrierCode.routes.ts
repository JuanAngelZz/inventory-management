import { Router } from 'express'
import {
  createCarrierCode,
  deleteCarrierCode,
  getCarrierCodes
} from '../controllers/carrierCode.controller'
import { validateToken } from '../middlewares/validateToken'
import { validateSchema } from '../middlewares/validateSchema'
import { carrierCodeSchema } from '../schemas/carrierCode.schema'

const router = Router()

router.get('/carrierCode', validateToken, getCarrierCodes)
router.post(
  '/carrierCode',
  validateToken,
  validateSchema(carrierCodeSchema),
  createCarrierCode
)
router.delete('/carrierCode/:id', validateToken, deleteCarrierCode)

export default router
