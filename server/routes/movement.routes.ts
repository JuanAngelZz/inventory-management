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

const router = Router()

router.get('/movements', getMovements)
router.post('/movements', validateSchema(movementSchema), createMovement)

router.get('/movements/:id', getMovement)
// router.put('/movements/:id', updateMovement)
// router.delete('/movements/:id', deleteMovement)

export default router
