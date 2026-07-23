'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'


export default function PlayerLogin() {
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
        setError(json.message || 'Email ou mot de passe incorrect')
        return
      }

      localStorage.setItem('player_token', json.data.token)
      localStorage.setItem('player_user', JSON.stringify(json.data.user))
      router.push('/account')
    } catch (err) {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <form onSubmit={handleSubmit} style={{ background: '#141414', border: '1px solid #1E1E1E', padding: '40px', borderRadius: '16px', width: '380px' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', color: '#FFFFFF', marginBottom: '8px' }}>
          Mon espace
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888', marginBottom: '28px' }}>
          Connecte-toi pour accéder à ton programme.
        </p>

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
          style={{ width: '100%', background: '#00C3D0', color: '#FFF', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', padding: '12px', borderRadius: '24px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', marginTop: '20px', textAlign: 'center' }}>
          Pas encore membre ? <Link href="/elite" style={{ color: '#00C3D0' }}>Rejoindre l'Elite</Link>
        </p>
      </form>
    </div>
  )
}