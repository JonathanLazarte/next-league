import { Router } from 'express'
import { dataController } from '../controllers/data.js'



export const dataRouter = Router()



dataRouter.get('/champion', dataController.getChamps)

dataRouter.get('/champion-full', dataController.getChampionFull)

dataRouter.get('/skin', dataController.getSkins)
