
import { useState } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function scan() {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`/api/scan?address=${address}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (e:any) {
      setError(e.message || 'Scan failed')
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Drop Watch</h1>
      <p>Ethereum airdrop tracker & discovery engine.</p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="0x... Ethereum address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button onClick={scan}>Scan</button>
      </div>

      {loading && <p>Scanning blockchain…</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: 24 }}>
          <h2>Results</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {data.results.map((r:any) => (
              <div key={r.id} className="card">
                <strong>{r.name}</strong>
                <p>Status: {r.status}</p>
                {r.claimUrl && (
                  <a href={r.claimUrl} target="_blank">Claim</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
