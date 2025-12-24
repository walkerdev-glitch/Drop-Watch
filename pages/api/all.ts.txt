import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(_, res) {
  const raw = await redis.hgetall('airdrops')
  const list = Object.values(raw || {}).map(v => JSON.parse(v as string))
  res.json(list)
}
