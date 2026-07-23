'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/components/PasswordInput'


export default function DashboardLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.message || 'Erreur de connexion')
        return
      }

      if (json.data.user.role !== 'admin' && json.data.user.role !== 'coach') {
        setError("Accès réservé aux administrateurs.")
        return
      }

      localStorage.setItem('admin_token', json.data.token)
      localStorage.setItem('admin_user', JSON.stringify(json.data.user))
      router.push('/dashboard')
    } catch (err) {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <form onSubmit={handleSubmit} style={{ background: '#141414', padding: '40px', borderRadius: '12px', width: '360px' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', color: '#FFFFFF', marginBottom: '24px' }}>
          Dashboard — Connexion
        </h1>

        {error && (
          <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
            {error}
          </p>
        )}

        <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '16px', outline: 'none' }}
        />

        <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px' }}>Mot de passe</label>
        <PasswordInput
        value={password}
         onChange={e => setPassword(e.target.value)}
        required
           style={{ width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '16px', outline: 'none' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', background: '#C8A84B', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px', borderRadius: '6px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}