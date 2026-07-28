'use client'
import { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin, X, Send } from 'lucide-react'

const btnGold = { display: 'flex', alignItems: 'center', gap: '6px', background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', padding: '9px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }
const inputStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', width: '100%' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px' }

const STATUS_LABELS = { pending: 'En attente', confirmed: 'Confirmée', rejected: 'Refusée', cancelled: 'Annulée' }
const STATUS_COLORS = { pending: '#C8A84B', confirmed: '#4CAF50', rejected: '#E53935', cancelled: '#666' }

export default function PlayerBookingsPage() {
  const [openSlots, setOpenSlots] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingSlotId, setBookingSlotId] = useState(null)
  const [showProposeForm, setShowProposeForm] = useState(false)
  const [proposeForm, setProposeForm] = useState({ coach_id: '', date: '', time: '', location: '' })
  const [proposeSaving, setProposeSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const token = localStorage.getItem('player_token')
      const [slotsRes, bookingsRes, coachesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability/open`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/coaches`),
      ])
      const slotsJson = await slotsRes.json()
      const bookingsJson = await bookingsRes.json()
      const coachesJson = await coachesRes.json()
      setOpenSlots(slotsJson.data || [])
      setMyBookings(bookingsJson.data || [])
      setCoaches(coachesJson.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleBookSlot(slotId) {
    setBookingSlotId(slotId)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/book-slot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slot_id: slotId }),
      })
      const json = await res.json()
      if (res.ok) {
        await fetchAll()
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setBookingSlotId(null)
    }
  }

  async function handlePropose(e) {
    e.preventDefault()
    setError('')
    setProposeSaving(true)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/propose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(proposeForm),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || 'Erreur')
        return
      }
      setMyBookings(prev => [json.data, ...prev])
      setProposeForm({ coach_id: '', date: '', time: '', location: '' })
      setShowProposeForm(false)
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setProposeSaving(false)
    }
  }

  async function handleCancel(id) {
    if (!confirm('Annuler cette réservation ?')) return
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (res.ok) {
        setMyBookings(prev => prev.map(b => b._id === id ? json.data : b))
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    }
  }

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Coaching présentiel
      </h1>

      {/* CRÉNEAUX DISPONIBLES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF' }}>Créneaux disponibles</p>
        {!showProposeForm && (
          <button onClick={() => setShowProposeForm(true)} style={{ background: 'none', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, padding: '8px 14px', borderRadius: '6px', border: '1px solid #C8A84B', cursor: 'pointer' }}>
            Proposer un autre horaire
          </button>
        )}
      </div>

      {showProposeForm && (
        <form onSubmit={handlePropose} style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <button type="button" onClick={() => setShowProposeForm(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
          {error && (
            <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Coach</label>
            <select style={inputStyle} value={proposeForm.coach_id} onChange={e => setProposeForm(p => ({ ...p, coach_id: e.target.value }))} required>
              <option value="">Sélectionner un coach...</option>
              {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Date souhaitée</label>
              <input type="date" style={inputStyle} value={proposeForm.date} onChange={e => setProposeForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div>
              <label style={labelStyle}>Heure souhaitée</label>
              <input type="time" style={inputStyle} value={proposeForm.time} onChange={e => setProposeForm(p => ({ ...p, time: e.target.value }))} required />
            </div>
            <div>
              <label style={labelStyle}>Lieu</label>
              <input style={inputStyle} placeholder="ex: Terrain proche de chez moi" value={proposeForm.location} onChange={e => setProposeForm(p => ({ ...p, location: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" disabled={proposeSaving} style={{ ...btnGold, opacity: proposeSaving ? 0.6 : 1 }}>
            <Send size={13} /> {proposeSaving ? 'Envoi...' : 'Envoyer la demande'}
          </button>
        </form>
      )}

      {openSlots.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', marginBottom: '32px' }}>Aucun créneau disponible pour l'instant.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {openSlots.map(slot => (
            <div key={slot._id} className="slotCard" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#141414', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '14px 18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#C8A84B" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF' }}>{new Date(slot.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} color="#888" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#CCC' }}>{slot.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
                <MapPin size={14} color="#888" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#CCC' }}>{slot.location}</span>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginRight: '8px' }}>{slot.coach_id?.name}</span>
              <button
                onClick={() => handleBookSlot(slot._id)}
                disabled={bookingSlotId === slot._id}
                style={{ ...btnGold, opacity: bookingSlotId === slot._id ? 0.6 : 1 }}
              >
                {bookingSlotId === slot._id ? '...' : 'Réserver'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MES RÉSERVATIONS */}
      <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>Mes réservations</p>

      {myBookings.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Aucune réservation pour l'instant.</p>
      ) : (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
          {myBookings.map((b, i) => (
            <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: i < myBookings.length - 1 ? '1px solid #1E1E1E' : 'none', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF', fontWeight: 600, marginBottom: '2px' }}>
                  {new Date(b.date).toLocaleDateString('fr-FR')} · {b.time}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>
                  {b.location} · {b.coach_id?.name}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                  background: `${STATUS_COLORS[b.status]}22`, color: STATUS_COLORS[b.status],
                }}>
                  {STATUS_LABELS[b.status]}
                </span>
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button onClick={() => handleCancel(b._id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}