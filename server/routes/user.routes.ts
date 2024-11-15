import { Router } from 'express'
import {
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  verifyUser
} from '../controllers/user.controller'
import { partialValidate, validateSchema } from '../middlewares/validateSchema'
import { userSchema } from '../schemas/user.schema'
import { validateToken } from '../middlewares/validateToken'

const router = Router()

router.post('/register', validateSchema(userSchema), registerUser)
router.post('/login', validateSchema(userSchema), loginUser)
router.post('/verify', verifyUser)

router.get('/users', validateToken, getUsers)
router.get('/users/:id', validateToken, getUser)
router.put('/users/:id', validateToken, partialValidate(userSchema), updateUser)
router.delete('/users/:id', validateToken, deleteUser)

export default router
