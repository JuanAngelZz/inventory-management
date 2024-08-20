import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from '../controllers/product.controller'
import { partialValidate, validateSchema } from '../middlewares/validateSchema'
import { productSchema } from '../schemas/product.schema'

const router = Router()

router.get('/products', getProducts)
router.post('/products', validateSchema(productSchema), createProduct)

router.get('/products/:id', getProduct)
router.put('/products/:id', partialValidate(productSchema), updateProduct)
router.delete('/products/:id', deleteProduct)

export default router
