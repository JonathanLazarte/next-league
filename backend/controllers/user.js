import { userModel } from '../models/user.js'

export class userController {

	static async saveSettings(req, res){
		const {userId, settings} = req.body
		const result = await userModel.saveSettings({userId, settings})

		!result.error ? res.status(200).json(result)
		: res.status(401).json({ error: result.error})
	}

	static async getUserData(req, res){
		const {token} = req.body
		const result = await userModel.getUserData({token})
		res.status(200).json(result)
	}

	static async getAllOwned(req, res){
		const {id} = req.body
		const pokemonOwned = await userModel.getAllOwned({id})
		res.status(200).json(pokemonOwned)
	}

	static async getUserSkins(req, res){
		const { userID } = req.body
		const result = await userModel.getUserSkins({userID})

		!result.error ? res.status(200).json(result)
		: res.status(401).json({ error: result.error})
	}
}
