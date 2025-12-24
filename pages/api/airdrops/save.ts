import { Redis } from '@upstash/redis'
import type { Airdrop } from '@/types/airdrop'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const airdrop: Airdrop = req.body

  if (!airdrop.id || !airdrop.name || !airdrop.contracts?.length) {
    return res.status(400).json({ error: 'Invalid airdrop data' })
  }

  await redis.hset('airdrops', {
    [airdrop.id]: JSON.stringify(airdrop),
  })

  res.json({ success: true })
}
