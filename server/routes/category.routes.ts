import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory
} from '../controllers/category.controller'
import { validateSchema } from '../middlewares/validateSchema'
import { categorySchema } from '../schemas/category.schema'
import { validateToken } from '../middlewares/validateToken'

const router = Router()

router.get('/categories', validateToken, getCategories)
router.post(
  '/categories',
  validateToken,
  validateSchema(categorySchema),
  createCategory
)

router.get('/categories/:id', validateToken, getCategory)
router.put(
  '/categories/:id',
  validateToken,
  validateSchema(categorySchema),
  updateCategory
)
router.delete('/categories/:id', validateToken, deleteCategory)

export default router
