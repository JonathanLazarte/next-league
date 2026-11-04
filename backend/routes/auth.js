import {Router} from 'express'
import { authController } from '../controllers/auth.js'

export const authRouter = Router()

authRouter.post('/register', authController.registerUser)

authRouter.post('/login', authController.loginUser)

authRouter.post('/verify', authController.verifyToken)
