'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

const inputStyle = { width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px', marginTop: '16px' }

export default function CoachForm({ initialData, coachId }) {
  const router = useRouter()
  const isEdit = !!coachId
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(initialData || {
    name: '', role: '', experience: '', diplomes: '', specialite: '', image: '', color: '#C8A84B', order: 0,
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/coaches/${coachId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/coaches`
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.errors?.map(e => e.message).join(', ') || json.message || 'Erreur')
        return
      }

      router.push('/dashboard/coaches')
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      {error && (
        <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}

      <label style={labelStyle}>Nom</label>
      <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} required />

      <label style={labelStyle}>Rôle</label>
      <input style={inputStyle} placeholder="ex: Coach Technique Principal" value={form.role} onChange={e => update('role', e.target.value)} required />

      <label style={labelStyle}>Spécialité</label>
      <input style={inputStyle} placeholder="ex: Technique & Tactique" value={form.specialite} onChange={e => update('specialite', e.target.value)} required />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Expérience</label>
          <input style={inputStyle} placeholder="ex: 12 ans" value={form.experience || ''} onChange={e => update('experience', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Diplômes</label>
          <input style={inputStyle} placeholder="ex: CAF A Licence" value={form.diplomes || ''} onChange={e => update('diplomes', e.target.value)} />
        </div>
      </div>

      <label style={labelStyle}>Photo (URL)</label>
      <input style={inputStyle} value={form.image || ''} onChange={e => update('image', e.target.value)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Couleur accent</label>
          <input type="color" style={{ ...inputStyle, height: '40px', padding: '4px' }} value={form.color} onChange={e => update('color', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Ordre d'affichage</label>
          <input type="number" style={inputStyle} value={form.order} onChange={e => update('order', e.target.value)} />
        </div>
      </div>

      <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #1E1E1E' }}>
        <button
          type="submit"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C8A84B', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          <Save size={15} /> {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le coach'}
        </button>
      </div>
    </form>
  )
}