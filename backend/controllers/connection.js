import { connectionModel } from '../models/connection.js'
import { isIP } from 'node:net'
import { z } from 'zod'

const optionalText = (maxLength) => z.string().trim().min(1).max(maxLength).optional();

const connectionSchema = z.object({
  ip: z.string().trim().max(45).refine((value) => isIP(value) !== 0, 'Invalid IP address'),
  path: z.string().trim().startsWith('/').max(2048),
  geo: z.object({
    country: optionalText(100),
    region: optionalText(100),
    city: optionalText(100),
    timeZone: optionalText(100),
  }).strict().optional(),
  userAgent: optionalText(512),
  language: optionalText(100),
}).strict()

export class connectionController {
  static async log(req, res) {
    const parsed = connectionSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid connection payload' })
    }

    try {
      const response = await connectionModel.log(parsed.data)
      return res.status(response.logged ? 201 : 202).json(response)
    } catch (error) {
      return res.status(500).json({ error: 'Unable to record connection' })
    }
  }
}
