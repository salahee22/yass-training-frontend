'use client'
import { useEffect, useState } from 'react'
import { Check, X, Trash2, Phone, Mail, Copy } from 'lucide-react'

const STATUS_LABELS = {
  nouvelle: { label: 'Nouvelle', color: '#00C3D0' },
  contactee: { label: 'Contactée', color: '#C8A84B' },
  acceptee: { label: 'Acceptée', color: '#4CAF50' },
  refusee: { label: 'Refusée', color: '#E53935' },
}

export default function DashboardApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [filter])

  async function fetchApplications() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const url = `${process.env.NEXT_PUBLIC_API_URL}/elite-applications${filter ? `?status=${filter}` : ''}`
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setApplications(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, status) {
    setBusyId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elite-applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (res.ok) {
        setApplications(prev => prev.map(a => a._id === id ? json.data : a))
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setBusyId(null)
    }
  }

  async function handleAccept(id) {
    if (!confirm('Accepter cette demande et créer le compte joueur ?')) return
    setBusyId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elite-applications/${id}/accept`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()

      if (!res.ok) {
        alert(json.message || 'Erreur')
        return
      }

      setApplications(prev => prev.map(a => a._id === id ? json.data.application : a))

      if (json.data.temp_password) {
        const info = `Compte créé !\n\nEmail: ${json.data.user.email}\nMot de passe temporaire: ${json.data.temp_password}\n\n⚠️ Ce mot de passe ne sera plus jamais affiché. Communique-le au joueur maintenant.`
        alert(info)
      } else {
        alert('Abonnement ajouté au compte existant de ce joueur.')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette demande définitivement ?')) return
    setBusyId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elite-applications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setApplications(prev => prev.filter(a => a._id !== id))
      } else {
        const json = await res.json()
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setBusyId(null)
    }
  }

  const filterOptions = [
    { value: '', label: 'Toutes' },
    { value: 'nouvelle', label: 'Nouvelles' },
    { value: 'contactee', label: 'Contactées' },
    { value: 'acceptee', label: 'Acceptées' },
    { value: 'refusee', label: 'Refusées' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Demandes Elite
      </h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              background: filter === opt.value ? '#C8A84B' : '#1E1E1E',
              color: filter === opt.value ? '#000' : '#AAA',
              fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
              padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
      ) : applications.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Aucune demande pour l'instant.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map(app => {
            const status = STATUS_LABELS[app.status] || STATUS_LABELS.nouvelle
            const busy = busyId === app._id
            return (
              <div key={app._id} style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
                      {app.prenom} {app.nom} — {app.age} ans
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginTop: '2px' }}>
                      {app.poste} · {app.niveau} · Offre: {app.offre}
                    </p>
                  </div>
                  <span style={{ background: `${status.color}22`, color: status.color, fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
                    {status.label}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA' }}>
                    <Mail size={12} /> {app.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA' }}>
                    <Phone size={12} /> {app.telephone}
                  </span>
                </div>

                {app.message && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#CCC', background: '#1A1A1A', padding: '10px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                    {app.message}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {app.status === 'nouvelle' && (
                    <button
                      onClick={() => handleStatusChange(app._id, 'contactee')}
                      disabled={busy}
                      style={{ background: '#1E1E1E', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    >
                      Marquer contactée
                    </button>
                  )}

                  {app.status !== 'acceptee' && app.status !== 'refusee' && (
                    <>
                      <button
                        onClick={() => handleAccept(app._id)}
                        disabled={busy}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      >
                        <Check size={13} /> Accepter
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'refusee')}
                        disabled={busy}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(229,57,53,0.1)', color: '#E53935', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={13} /> Refuser
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(app._id)}
                    disabled={busy}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: '1px solid #262626', cursor: 'pointer', marginLeft: 'auto' }}
                  >
                    <Trash2 size={13} /> Suppr.
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}