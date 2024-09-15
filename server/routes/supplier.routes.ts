import { Router } from 'express'
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSuppliers,
  updateSupplier
} from '../controllers/supplier.controller'
import { validateToken } from '../middlewares/validateToken'
import { partialValidate, validateSchema } from '../middlewares/validateSchema'
import { supplierSchema } from '../schemas/supplier.schema'

const router = Router()

router.get('/suppliers', validateToken, getSuppliers)
router.post(
  '/suppliers',
  validateToken,
  validateSchema(supplierSchema),
  createSupplier
)

router.get('/suppliers/:id', validateToken, getSupplier)
router.put(
  '/suppliers/:id',
  validateToken,
  partialValidate(supplierSchema),
  updateSupplier
)
router.delete('/suppliers/:id', validateToken, deleteSupplier)

export default router
