'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Calendar } from 'lucide-react'

export default function DashboardPlayers() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const token = localStorage.getItem('admin_token')
        console.log('TOKEN:', token)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=player`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log('STATUS:', res.status)

        const json = await res.json()
        console.log('JSON:', json)

        setPlayers(json.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [])

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Joueurs
      </h1>

      {loading ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
      ) : players.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Aucun joueur pour l'instant.</p>
      ) : (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
          {players.map((player, i) => (
            <div
              key={player._id}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                borderBottom: i < players.length - 1 ? '1px solid #1E1E1E' : 'none',
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="#888" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>
                  {player.name}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>
                  {player.email}
                </p>
              </div>
              <Link
                href={`/dashboard/players/${player._id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1E1E1E', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none' }}
              >
                <Calendar size={13} /> Voir le profil
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}