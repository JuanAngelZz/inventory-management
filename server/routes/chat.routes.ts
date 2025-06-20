import { Router } from 'express'
import {
    postChat
} from '../controllers/chat.controller'
import { validateToken } from '../middlewares/validateToken'

const router = Router()

router.post(
  '/chat',
  validateToken,
  postChat
)

export default router
