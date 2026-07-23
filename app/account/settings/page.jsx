'use client'
import { useState } from 'react'
import { Save } from 'lucide-react'
import PasswordInput from '@/components/PasswordInput'

const inputStyle = { width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px', marginTop: '16px' }

export default function SettingsPage() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (form.new_password !== form.confirm_password) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          current_password: form.current_password,
          new_password: form.new_password,
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.errors?.map(e => e.message).join(', ') || json.message || 'Erreur')
        return
      }

      setSuccess(true)
      setForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Paramètres
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '420px', background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '24px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>
          Changer le mot de passe
        </p>

        {error && (
          <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginTop: '16px', fontFamily: 'Inter, sans-serif' }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginTop: '16px', fontFamily: 'Inter, sans-serif' }}>
            Mot de passe mis à jour avec succès.
          </p>
        )}

        <label style={labelStyle}>Mot de passe actuel</label>
        <PasswordInput
          style={inputStyle}
          value={form.current_password}
          onChange={e => update('current_password', e.target.value)}
          required
        />

        <label style={labelStyle}>Nouveau mot de passe</label>
        <PasswordInput
          style={inputStyle}
          value={form.new_password}
          onChange={e => update('new_password', e.target.value)}
          required
          minLength={6}
        />

        <label style={labelStyle}>Confirmer le nouveau mot de passe</label>
        <PasswordInput
          style={inputStyle}
          value={form.confirm_password}
          onChange={e => update('confirm_password', e.target.value)}
          required
          minLength={6}
        />

        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#00C3D0', color: '#FFF', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', padding: '12px 24px', borderRadius: '24px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            <Save size={15} /> {saving ? 'Enregistrement...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  )
}