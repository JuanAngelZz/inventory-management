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

const router = Router()

router.get('/categories', getCategories)
router.post('/categories', validateSchema(categorySchema), createCategory)

router.get('/categories/:id', getCategory)
router.put('/categories/:id', validateSchema(categorySchema), updateCategory)
router.delete('/categories/:id', deleteCategory)

export default router
