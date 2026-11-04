import { authModel } from '../models/auth.js'

export class authController {

 	static async registerUser(req , res){
		const body = req.body
     const result = await authModel.registerUser({ body })
     console.log(result)
     if (!result.success) {
       return res.status(401).json({ error: result.error})
     }
		return res.status(200).json(result.data)
	}

	static async loginUser(req, res){
		const body = req.body
		const result = await authModel.loginUser({body})

		if (!result.success) {
		  return res.status(401).json({ error: result.error });
		}

		return res.status(200).json(result.data);
	}

	static async verifyToken(req, res){
		const {token} = req.body
     const result = await authModel.verifyToken({ token })
     if (!result.success) {
       return res.status(401).json({ error: result.error})
		}
		return res.status(200).json(result.data)
	}

}
