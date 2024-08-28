import { Router } from 'express'
import {
  createMovement,
  getMovement,
  getMovements
  // updateMovement
  // deleteMovement,
} from '../controllers/movement.controller'
import { validateSchema } from '../middlewares/validateSchema'
import { movementSchema } from '../schemas/movement.schema'
import { validateToken } from '../middlewares/validateToken'

const router = Router()

router.get('/movements', validateToken, getMovements)
router.post(
  '/movements',
  validateToken,
  validateSchema(movementSchema),
  createMovement
)

router.get('/movements/:id', validateToken, getMovement)
// router.put('/movements/:id', updateMovement)
// router.delete('/movements/:id', deleteMovement)

export default router
