import { connectionModel } from '../models/connection.js'

export class connectionController {
  static async log(req, res) {
    const { ip, path } = req.body;
    const response = await connectionModel.log({ ip, path })
    res.status(200).json(response)
  }
}
