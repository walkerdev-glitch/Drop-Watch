import { useState } from 'react'

export default function AdminAirdrops() {
  const [form, setForm] = useState<any>({})

  async function save() {
    await fetch('/api/airdrops/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    alert('Airdrop saved')
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Airdrop Registry</h1>

      <input placeholder="ID"
        onChange={e => setForm({ ...form, id: e.target.value })} />

      <input placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Contracts (comma separated)"
        onChange={e => setForm({
          ...form,
          contracts: e.target.value.split(',').map(v => v.trim()),
        })} />

      <input placeholder="Snapshot block"
        onChange={e => setForm({
          ...form,
          snapshot: { chain: 'eth', block: Number(e.target.value) },
        })} />

      <input placeholder="Claim URL"
        onChange={e => setForm({ ...form, claimUrl: e.target.value })} />

      <button onClick={save}>Save</button>
    </div>
  )
}
