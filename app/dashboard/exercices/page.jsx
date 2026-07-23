'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function DashboardExercices() {
  const [exercices, setExercices] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchExercices()
  }, [])

  async function fetchExercices() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices?limit=100`)
      const json = await res.json()
      setExercices(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cet exercice définitivement ?')) return
    setDeletingId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setExercices(prev => prev.filter(e => e._id !== id))
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF' }}>
          Exercices
        </h1>
        <Link
          href="/dashboard/exercices/new"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C8A84B', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: '6px', textDecoration: 'none' }}
        >
          <Plus size={14} /> Nouvel exercice
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
      ) : exercices.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Aucun exercice pour l'instant.</p>
      ) : (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
          {exercices.map((ex, i) => (
            <div
              key={ex._id}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                borderBottom: i < exercices.length - 1 ? '1px solid #1E1E1E' : 'none',
              }}
            >
              <img src={ex.image} alt={ex.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ex.name}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>
                  {ex.theme} · {ex.age} · {ex.type === 'goalkeeper' ? 'Gardien' : 'Joueur'}
                </p>
              </div>
              <Link
                href={`/dashboard/exercices/${ex._id}/edit`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1E1E1E', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none' }}
              >
                <Pencil size={13} /> Éditer
              </Link>
              <button
                onClick={() => handleDelete(ex._id)}
                disabled={deletingId === ex._id}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(229,57,53,0.1)', color: '#E53935', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={13} /> {deletingId === ex._id ? '...' : 'Suppr.'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}