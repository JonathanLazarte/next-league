import { Router } from 'express'
import { connectionController } from '../controllers/connection.js'

export const connectionRouter = Router()

connectionRouter.post('/', connectionController.log)
