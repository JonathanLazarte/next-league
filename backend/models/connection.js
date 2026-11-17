import { database } from '../db.js'

const connectionsCollection = database.collection('connections')
const minimumIntervalSeconds = Number.parseInt(
  process.env.CONNECTION_LOG_MIN_INTERVAL_SECONDS ?? '60',
  10,
)
const minimumIntervalMs = Number.isFinite(minimumIntervalSeconds)
  ? Math.max(minimumIntervalSeconds, 0) * 1_000
  : 60_000
const lastLoggedAt = new Map()

export class connectionModel {
  static async log({ ip, path, geo, userAgent, language }) {
    const now = new Date()
    const previousLog = lastLoggedAt.get(ip)

    if (previousLog && now.getTime() - previousLog < minimumIntervalMs) {
      return { logged: false, reason: 'rate_limited' }
    }

    await connectionsCollection.updateOne(
      { ip },
      {
        $set: {
          lastSeen: now,
          lastPath: path,
          geo: geo ?? null,
          userAgent: userAgent ?? null,
          language: language ?? null,
        },
        $setOnInsert: { firstSeen: now },
        $inc: { visits: 1 },
      },
      { upsert: true },
    )

    lastLoggedAt.set(ip, now.getTime())
    if (lastLoggedAt.size > 10_000) {
      const cutoff = now.getTime() - minimumIntervalMs
      for (const [loggedIp, loggedAt] of lastLoggedAt) {
        if (loggedAt < cutoff) lastLoggedAt.delete(loggedIp)
      }
    }

    return { logged: true }
  }
}
