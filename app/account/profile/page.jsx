'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

const POSITIONS = ['Attaquant', 'Milieu de terrain', 'Défenseur', 'Gardien de but', 'Polyvalent']

const inputStyle = { width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px', marginTop: '16px' }

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [exists, setExists] = useState(false)
  const [form, setForm] = useState({
  birth_day: '', position: '', club: '', phone: '', height: '', weight: '', medical_info: '',
})

  useEffect(() => {
    async function fetchProfil() {
      const token = localStorage.getItem('player_token')
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const json = await res.json()
          const data = json.data
          setForm({
            birth_day: data.birth_day ? data.birth_day.slice(0, 10) : '',
            position: data.position || '',
            club: data.club || '',
            phone: data.phone || '',
            height: data.height || '',
            weight: data.weight || '',
            medical_info: data.medical_info || '',
            })
          setExists(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfil()
  }, [])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const token = localStorage.getItem('player_token')
      const payload = {
        ...form,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        birth_day: form.birth_day || null,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: exists ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.errors?.map(e => e.message).join(', ') || json.message || 'Erreur')
        return
      }

      router.push('/account')
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Mon profil
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '480px', background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '24px' }}>
        {error && (
          <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
            {error}
          </p>
        )}

        <label style={labelStyle}>Date de naissance</label>
        <input type="date" style={inputStyle} value={form.birth_day} onChange={e => update('birth_day', e.target.value)} />

        <label style={labelStyle}>Poste</label>
        <select style={inputStyle} value={form.position} onChange={e => update('position', e.target.value)}>
          <option value="">Sélectionner...</option>
          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
   

        <label style={labelStyle}>Club</label>
        <input style={inputStyle} value={form.club} onChange={e => update('club', e.target.value)} />

        <label style={labelStyle}>Téléphone</label>
        <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} />


        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Taille (cm)</label>
            <input type="number" style={inputStyle} value={form.height} onChange={e => update('height', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Poids (kg)</label>
            <input type="number" style={inputStyle} value={form.weight} onChange={e => update('weight', e.target.value)} />
          </div>
        </div>

        <label style={labelStyle}>Informations médicales</label>
        <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.medical_info} onChange={e => update('medical_info', e.target.value)} placeholder="Allergies, blessures, traitements..." />

        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#00C3D0', color: '#FFF', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', padding: '12px 24px', borderRadius: '24px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            <Save size={15} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}