import { dataModel } from '../models/data.js'



export class dataController{

  static async getChamps(req, res) {
  const champs = await dataModel.getChamps()
  res.status(200).json(champs)
	}

	static async getChampionFull (req, res){
	const champ = await dataModel.getChampionFull()
	res.status(200).json(champ)
	}

	static async getSkins (req, res){
	const skins = await dataModel.getSkins()
	res.status(200).json(skins)
	}

}
