import { Router } from 'express'
import { userController } from '../controllers/user.js'

export const userRouter = Router()

userRouter.post('/', userController.getUserData)

userRouter.post('/champion-collection', userController.getAllOwned)

userRouter.post('/skin-collection', userController.getUserSkins)

userRouter.post('/save-settings', userController.saveSettings)
