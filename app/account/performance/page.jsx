'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, TrendingUp, X, Activity } from 'lucide-react'

const inputStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', width: '100%' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px' }
const btnGold = { display: 'flex', alignItems: 'center', gap: '6px', background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }

export default function PerformancePage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ value: '', unite: '', notes: '', record_date: new Date().toISOString().slice(0, 10) })

  useEffect(() => {
    fetchRecords()
  }, [])

  async function fetchRecords() {
    setLoading(true)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/performance-records?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setRecords(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.value || !form.unite.trim()) {
      setError('Renseigne au moins la valeur et l\'unité.')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/performance-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          value: Number(form.value),
          unite: form.unite.trim(),
          notes: form.notes || null,
          record_date: form.record_date,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.errors?.map(e => e.message).join(', ') || json.message || 'Erreur')
        return
      }
      setRecords(prev => [json.data, ...prev])
      setForm({ value: '', unite: '', notes: '', record_date: new Date().toISOString().slice(0, 10) })
      setShowForm(false)
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette mesure ?')) return
    try {
      const token = localStorage.getItem('player_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/performance-records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecords(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      alert('Erreur réseau')
    }
  }

  const grouped = records.reduce((acc, r) => {
    if (!acc[r.unite]) acc[r.unite] = []
    acc[r.unite].push(r)
    return acc
  }, {})

  const groups = Object.keys(grouped).sort()

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Mes performances
      </h1>

      <ConsistencySection />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF' }}>Mes mesures</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={btnGold}>
            <Plus size={14} /> Ajouter une mesure
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {error && (
            <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}

          <div className="valueUniteGrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Valeur</label>
              <input type="number" step="any" style={inputStyle} placeholder="ex: 72.5" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Unité</label>
              <input style={inputStyle} placeholder="ex: kg, cm, sec, km/h" value={form.unite} onChange={e => setForm(p => ({ ...p, unite: e.target.value }))} />
            </div>
          </div>

          <label style={labelStyle}>Date</label>
          <input type="date" style={{ ...inputStyle, marginBottom: '12px' }} value={form.record_date} onChange={e => setForm(p => ({ ...p, record_date: e.target.value }))} />

          <label style={labelStyle}>Notes (optionnel)</label>
          <textarea style={{ ...inputStyle, minHeight: '60px', marginBottom: '16px' }} placeholder="ex: après séance de sprint, à jeun..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />

          <button type="submit" disabled={saving} style={{ ...btnGold, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>

          <style jsx>{`
            @media (max-width: 420px) {
              .valueUniteGrid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
      ) : records.length === 0 ? (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <TrendingUp size={28} color="#444" style={{ marginBottom: '12px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#888' }}>
            Aucune mesure enregistrée. Ajoute ta première performance pour commencer le suivi.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {groups.map(unite => (
            <MetricGroup key={unite} unite={unite} records={grouped[unite]} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConsistencySection() {
  const [loading, setLoading] = useState(true)
  const [weekStats, setWeekStats] = useState([])
  const [programDesc, setProgramDesc] = useState(null)

  useEffect(() => {
    fetchConsistency()
  }, [])

  async function fetchConsistency() {
    setLoading(true)
    try {
      const token = localStorage.getItem('player_token')
      const progRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programmes`, { headers: { Authorization: `Bearer ${token}` } })
      const progJson = await progRes.json()
      const programs = progJson.data || []

      if (programs.length === 0) {
        setWeekStats([])
        setLoading(false)
        return
      }

      const latestProgram = [...programs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      setProgramDesc(latestProgram.description || 'Programme personnalisé')

      const entriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercice-programmes/${latestProgram._id}`, { headers: { Authorization: `Bearer ${token}` } })
      const entriesJson = await entriesRes.json()
      const entries = entriesJson.data || []

      const restDays = latestProgram.rest_days || []

      const byWeek = {}
      entries.forEach(entry => {
        const w = entry.week_num
        if (!byWeek[w]) byWeek[w] = { total: 0, completed: 0, daysWithActivity: new Set(), daysCompleted: new Set() }
        byWeek[w].total += 1
        if (entry.complete) byWeek[w].completed += 1
        byWeek[w].daysWithActivity.add(entry.day_num)
      })

      Object.keys(byWeek).forEach(w => {
        const dayGroups = {}
        entries.filter(e => e.week_num === Number(w)).forEach(e => {
          if (!dayGroups[e.day_num]) dayGroups[e.day_num] = []
          dayGroups[e.day_num].push(e)
        })
        Object.entries(dayGroups).forEach(([day, dayEntries]) => {
          if (dayEntries.every(e => e.complete)) byWeek[w].daysCompleted.add(Number(day))
        })
      })

      const stats = Object.keys(byWeek).sort((a, b) => a - b).map(w => ({
        week_num: Number(w),
        total: byWeek[w].total,
        completed: byWeek[w].completed,
        trainingDaysPlanned: byWeek[w].daysWithActivity.size,
        trainingDaysDone: byWeek[w].daysCompleted.size,
        restDaysCount: restDays.length,
      }))

      setWeekStats(stats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null
  if (weekStats.length === 0) return null

  const latest = weekStats[weekStats.length - 1]
  const latestPct = latest.total > 0 ? Math.round((latest.completed / latest.total) * 100) : 0
  const avgPct = Math.round(weekStats.reduce((sum, w) => sum + (w.total > 0 ? (w.completed / w.total) * 100 : 0), 0) / weekStats.length)

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px' }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>
        <Activity size={13} /> Assiduité — {programDesc}
      </p>

      <div className="statBoxGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <StatBox label="Dernière semaine" value={`${latest.completed}/${latest.total}`} sub="exercices faits" />
        <StatBox label="Taux dernière semaine" value={`${latestPct}%`} sub="complétion" />
        <StatBox label="Jours d'entraînement" value={`${latest.trainingDaysDone}/${latest.trainingDaysPlanned}`} sub="terminés" />
      </div>

      {weekStats.length > 1 && (
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Évolution par semaine · moyenne globale : {avgPct}%
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px', marginBottom: '10px', overflowX: 'auto' }}>
            {weekStats.map(w => {
              const pct = w.total > 0 ? (w.completed / w.total) * 100 : 0
              const isLatest = w.week_num === latest.week_num
              return (
                <div key={w.week_num} style={{ flex: '1 0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    title={`Semaine ${w.week_num} : ${w.completed}/${w.total} (${Math.round(pct)}%)`}
                    style={{
                      width: '100%', height: `${Math.max(pct, 4)}%`,
                      background: isLatest ? '#C8A84B' : '#2A2A2A',
                      borderRadius: '3px', minHeight: '4px',
                    }}
                  />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#666' }}>S{w.week_num}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {latest.total === 0 && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666' }}>
          Aucun exercice assigné pour l'instant sur ce programme.
        </p>
      )}

      <style jsx>{`
        @media (max-width: 380px) {
          .statBoxGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function StatBox({ label, value, sub }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid #262626', borderRadius: '8px', padding: '14px' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#666', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '2px' }}>{value}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#888' }}>{sub}</p>
    </div>
  )
}

function MetricGroup({ unite, records, onDelete }) {
  const sorted = [...records].sort((a, b) => new Date(a.record_date) - new Date(b.record_date))
  const values = sorted.map(r => r.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const latest = sorted[sorted.length - 1]
  const first = sorted[0]
  const trend = sorted.length > 1 ? latest.value - first.value : 0

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>
            {unite}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 900, color: '#FFF' }}>
            {latest.value} <span style={{ fontSize: '14px', color: '#666', fontWeight: 400 }}>{unite}</span>
          </p>
        </div>
        {sorted.length > 1 && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: trend > 0 ? '#C8A84B' : trend < 0 ? '#888' : '#666' }}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)} {unite}
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>depuis la 1ère mesure</p>
          </div>
        )}
      </div>

      {sorted.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px', marginBottom: '16px' }}>
          {sorted.map((r, i) => {
            const range = max - min || 1
            const heightPct = 20 + ((r.value - min) / range) * 80
            return (
              <div
                key={r._id}
                title={`${r.value} ${unite} — ${new Date(r.record_date).toLocaleDateString('fr-FR')}`}
                style={{
                  flex: 1, height: `${heightPct}%`,
                  background: i === sorted.length - 1 ? '#C8A84B' : '#2A2A2A',
                  borderRadius: '2px', minWidth: '4px',
                }}
              />
            )
          })}
        </div>
      )}

      <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '12px' }}>
        {[...sorted].reverse().map(r => (
          <div key={r._id} className="recordRow" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid #1A1A1A', flexWrap: 'wrap' }}>
            <span className="recordDate" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666', width: '80px', flexShrink: 0 }}>
              {new Date(r.record_date).toLocaleDateString('fr-FR')}
            </span>
            <span className="recordValue" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#FFF', width: '70px', flexShrink: 0 }}>
              {r.value} {unite}
            </span>
            {r.notes && (
              <span className="recordNotes" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', flex: 1, minWidth: 0 }}>
                {r.notes}
              </span>
            )}
            <button onClick={() => onDelete(r._id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', flexShrink: 0 }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 420px) {
          .recordRow {
            position: relative;
            padding-right: 28px !important;
          }
          .recordDate {
            width: auto !important;
            order: 1;
          }
          .recordValue {
            width: auto !important;
            order: 2;
          }
          .recordNotes {
            order: 4;
            flex-basis: 100% !important;
            margin-top: 4px;
          }
          .recordRow > button {
            position: absolute;
            top: 8px;
            right: 0;
          }
        }
      `}</style>
    </div>
  )
}