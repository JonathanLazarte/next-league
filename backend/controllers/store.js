import { storeModel } from '../models/store.js'

export class storeController {
	static async buySkin(req, res) {
		const {userId, skinId, coin, price} = req.body
		const result = await storeModel.buySkin({userId, skinId, coin, price})

		res.status(200).json(result)
  }
  static async buyChampion(req, res) {
		const {userId, championId, coin, price} = req.body
		const result = await storeModel.buyChampion({userId, championId, coin, price})

		res.status(200).json(result)
	}
}
