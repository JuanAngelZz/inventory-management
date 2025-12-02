import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  getExpiringProducts
} from '../controllers/product.controller'
import { partialValidate, validateSchema } from '../middlewares/validateSchema'
import { productSchema } from '../schemas/product.schema'
import { validateToken } from '../middlewares/validateToken'

const router = Router()

router.get('/products', validateToken, getProducts)
router.get('/products/expiring', validateToken, getExpiringProducts)
router.post(
  '/products',
  validateToken,
  validateSchema(productSchema),
  createProduct
)

router.get('/products/:id', validateToken, getProduct)
router.put(
  '/products/:id',
  validateToken,
  partialValidate(productSchema),
  updateProduct
)
router.delete('/products/:id', validateToken, deleteProduct)

export default router
