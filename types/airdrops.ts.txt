export interface Airdrop {
  id: string
  name: string
  contracts: string[]
  claimUrl: string

  snapshot?: {
    chain: 'eth'
    block: number
  }

  offchain?: {
    provider: string
    confidence: 'low' | 'medium' | 'high'
  }
}
