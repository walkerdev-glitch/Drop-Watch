
import { isAddress } from 'viem'
import { Alchemy, Network } from '@alch/alchemy-sdk'
import { Redis } from '@upstash/redis'
import AIRDROPS from '../../data/airdrops.json'

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
})

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  try {
    const { address } = req.query
    if (!isAddress(address)) return res.status(400).json({ error: 'Invalid address' })

    const cached = await redis.get(address)
    if (cached) return res.json(cached)

    const txs = await alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: ['external', 'erc20', 'erc721'],
      maxCount: 1000
    })

    const interacted = new Set(txs.transfers.map(t => t.to?.toLowerCase()))
    const results = AIRDROPS.map(d => ({
      id: d.id,
      name: d.name,
      status: d.contracts.some(c => interacted.has(c.toLowerCase())) ? 'potential' : 'not_eligible',
      claimUrl: d.claimUrl
    }))

    const payload = { address, results }
    await redis.set(address, payload, { ex: 3600 })
    res.json(payload)
  } catch {
    res.status(500).json({ error: 'Scan failed' })
  }
}
