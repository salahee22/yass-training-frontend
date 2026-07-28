'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Check, X, Calendar, MapPin, Clock } from 'lucide-react'

const inputStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', width: '100%' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px' }
const btnGold = { display: 'flex', alignItems: 'center', gap: '6px', background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }

const STATUS_LABELS = { pending: 'En attente', confirmed: 'Confirmée', rejected: 'Refusée', cancelled: 'Annulée' }
const STATUS_COLORS = { pending: '#C8A84B', confirmed: '#4CAF50', rejected: '#E53935', cancelled: '#666' }

export default function DashboardBookingsPage() {
  const [tab, setTab] = useState('slots')

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Coaching présentiel
      </h1>

      <div className="tabPills" style={{ display: 'flex', gap: '0', border: '1px solid #1E1E1E', borderRadius: '10px', overflow: 'hidden', maxWidth: '340px', width: '100%', marginBottom: '32px' }}>
        {[{ key: 'slots', label: 'Créneaux' }, { key: 'bookings', label: 'Réservations' }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '12px 16px',
              fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700,
              background: tab === t.key ? '#1E1E1E' : 'transparent',
              color: tab === t.key ? '#FFF' : '#888',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'slots' ? <SlotsManager /> : <BookingsManager />}
    </div>
  )
}

function SlotsManager() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: '', time: '', location: '' })

  useEffect(() => { fetchSlots() }, [])

  async function fetchSlots() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setSlots(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || 'Erreur')
        return
      }
      setSlots(prev => [...prev, json.data].sort((a, b) => new Date(a.date) - new Date(b.date)))
      setForm({ date: '', time: '', location: '' })
      setShowForm(false)
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce créneau ?')) return
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setSlots(prev => prev.filter(s => s._id !== id))
      } else {
        const json = await res.json()
        alert(json.message || 'Erreur lors de la suppression')
      }
    } catch (err) {
      alert('Erreur réseau')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF' }}>Créneaux disponibles</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={btnGold}>
            <Plus size={14} /> Ajouter un créneau
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          {error && (
            <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div>
              <label style={labelStyle}>Heure</label>
              <input type="time" style={inputStyle} value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required />
            </div>
            <div>
              <label style={labelStyle}>Lieu</label>
              <input style={inputStyle} placeholder="ex: Stade communal, Chéraga" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving} style={{ ...btnGold, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Ajout...' : 'Ajouter'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '10px 16px', borderRadius: '6px', border: '1px solid #262626', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
      ) : slots.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Aucun créneau pour l'instant.</p>
      ) : (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
          {slots.map((slot, i) => (
            <div key={slot._id} className="slotRow" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: i < slots.length - 1 ? '1px solid #1E1E1E' : 'none', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
                <Calendar size={14} color="#C8A84B" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF' }}>
                  {new Date(slot.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                <Clock size={14} color="#888" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#CCC' }}>{slot.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '160px' }}>
                <MapPin size={14} color="#888" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#CCC' }}>{slot.location}</span>
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                background: slot.is_booked ? 'rgba(229,57,53,0.15)' : 'rgba(76,175,80,0.15)',
                color: slot.is_booked ? '#E53935' : '#4CAF50',
              }}>
                {slot.is_booked ? 'Réservé' : 'Libre'}
              </span>
              {!slot.is_booked && (
                <button onClick={() => handleDelete(slot._id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BookingsManager() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setBookings(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, status) {
    setUpdatingId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? json.data : b))
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setUpdatingId(null)
    }
  }

  async function cancelBooking(id) {
    if (!confirm('Annuler cette réservation ?')) return
    setUpdatingId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? json.data : b))
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
  if (bookings.length === 0) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Aucune réservation pour l'instant.</p>

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
      {bookings.map((b, i) => (
        <div key={b._id} className="bookingRow" style={{ padding: '16px 20px', borderBottom: i < bookings.length - 1 ? '1px solid #1E1E1E' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>
                {b.player_id?.name || 'Joueur'}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>
                {new Date(b.date).toLocaleDateString('fr-FR')} · {b.time} · {b.location}
              </p>
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
              background: `${STATUS_COLORS[b.status]}22`, color: STATUS_COLORS[b.status], flexShrink: 0,
            }}>
              {STATUS_LABELS[b.status]}
            </span>
          </div>

          {b.status === 'pending' && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => updateStatus(b._id, 'confirmed')}
                disabled={updatingId === b._id}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                <Check size={13} /> Confirmer
              </button>
              <button
                onClick={() => updateStatus(b._id, 'rejected')}
                disabled={updatingId === b._id}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(229,57,53,0.15)', color: '#E53935', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, padding: '7px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                <X size={13} /> Refuser
              </button>
            </div>
          )}

          {b.status === 'confirmed' && (
            <button
              onClick={() => cancelBooking(b._id)}
              disabled={updatingId === b._id}
              style={{ background: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '7px 14px', borderRadius: '6px', border: '1px solid #262626', cursor: 'pointer' }}
            >
              Annuler la réservation
            </button>
          )}
        </div>
      ))}
    </div>
  )
}