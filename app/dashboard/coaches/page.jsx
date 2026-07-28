'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function DashboardCoaches() {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchCoaches()
  }, [])

  async function fetchCoaches() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coaches`)
      const json = await res.json()
      setCoaches(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce coach définitivement ?')) return
    setDeletingId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coaches/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setCoaches(prev => prev.filter(c => c._id !== id))
      } else {
        const json = await res.json()
        alert(json.message || 'Erreur lors de la suppression')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="headerRow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF' }}>
          Coachs
        </h1>
        <Link
          href="/dashboard/coaches/new"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C8A84B', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: '6px', textDecoration: 'none' }}
        >
          <Plus size={14} /> Nouveau coach
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
      ) : coaches.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Aucun coach pour l'instant.</p>
      ) : (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
          {coaches.map((coach, i) => (
            <div
              key={coach._id}
              className="coachRow"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                borderBottom: i < coaches.length - 1 ? '1px solid #1E1E1E' : 'none',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#1E1E1E' }}>
                {coach.image && <img src={coach.image} alt={coach.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div className="coachInfo" style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  {coach.name}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>
                  {coach.role} · {coach.specialite}
                </p>
              </div>
              <div className="coachActions" style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <Link
                  href={`/dashboard/coaches/${coach._id}/edit`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1E1E1E', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  <Pencil size={13} /> Éditer
                </Link>
                <button
                  onClick={() => handleDelete(coach._id)}
                  disabled={deletingId === coach._id}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(229,57,53,0.1)', color: '#E53935', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <Trash2 size={13} /> {deletingId === coach._id ? '...' : 'Suppr.'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 600px) {
          .headerRow {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px;
          }
          .coachRow {
            flex-wrap: wrap;
          }
          .coachInfo {
            min-width: 140px !important;
          }
          .coachActions {
            width: 100%;
            justify-content: flex-end;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  )
}