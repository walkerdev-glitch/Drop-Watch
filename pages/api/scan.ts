import { isAddress } from 'viem'
import { Alchemy, Network } from 'alchemy-sdk'
import AIRDROPS from '../../data/airdrops.json'

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY!,
  network: Network.ETH_MAINNET,
})

export default async function handler(req, res) {
  const { address } = req.query

  if (!isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' })
  }

  try {
    const txs = await alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: ['external', 'erc20', 'erc721'],
      maxCount: 1000,
    })

    const interacted = new Set(
      txs.transfers.map(t => t.to?.toLowerCase()).filter(Boolean)
    )

    const results = AIRDROPS.map(d => ({
      id: d.id,
      name: d.name,
      status: d.contracts.some(c => interacted.has(c.toLowerCase()))
        ? 'potential'
        : 'not_eligible',
      claimUrl: d.claimUrl,
    }))

    return res.json({ address, results })
  } catch (error) {
    console.error('Alchemy failure:', error)
    return res.status(500).json({ error: 'Alchemy request failed' })
  }
}
