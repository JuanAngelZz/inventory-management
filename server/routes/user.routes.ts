import { Router } from 'express'
import {
  loginUser,
  registerUser,
  verifyUser
} from '../controllers/user.controller'
import { validateSchema } from '../middlewares/validateSchema'
import { userSchema } from '../schemas/user.schema'

const router = Router()

router.post('/register', validateSchema(userSchema), registerUser)
router.post('/login', validateSchema(userSchema), loginUser)
router.post('/verify', verifyUser)

export default router
