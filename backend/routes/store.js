import { Router } from 'express'
import { storeController } from '../controllers/store.js'

export const storeRouter = Router()

storeRouter.post('/skin', storeController.buySkin)

storeRouter.post('/champion', storeController.buyChampion)
