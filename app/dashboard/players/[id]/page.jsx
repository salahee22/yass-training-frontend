'use client'
import { useEffect, useState, use } from 'react'
import { Plus, Trash2, Check, X, Dumbbell, Apple, MessageCircle } from 'lucide-react'

const MEAL_LABELS = {
  petit_dejeuner: 'Petit-déjeuner',
  collation_matin: 'Collation (matin)',
  dejeuner: 'Déjeuner',
  collation_apres_midi: 'Collation (après-midi)',
  diner: 'Dîner',
}

const DAYS = [1, 2, 3, 4, 5, 6, 7]

const PLAN_LABELS = { basic: 'Basic (Elite 1)', premium: 'Premium (Elite 2)', elite: 'Elite (Elite 3)' }
const PLAN_PRICES = { basic: 4500, premium: 8500, elite: 14000 }

const FEELING_LABELS = { fatigue: 'Fatigué', moyen: 'Moyen', en_forme: 'En forme' }
const FEELING_COLORS = { fatigue: '#E53935', moyen: '#FFF', en_forme: '#4CAF50' }
const LOAD_LABELS = { baisser: '↓ Baisser la charge', garder: '= Garder pareil', augmenter: '↑ Augmenter la charge' }

const inputStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '8px 10px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '12px', outline: 'none', width: '100%' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888', marginBottom: '4px' }
const btnGold = { background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }
const btnOutline = { background: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: '1px solid #262626', cursor: 'pointer' }

function emptyExerciseRow() { return { name: '', sets: '', reps: '', rest: '', notes: '' } }
function emptyMealRow() { return { meal_type: 'petit_dejeuner', content: '' } }
function emptyWeekDays() {
  const days = {}
  DAYS.forEach(d => { days[d] = { exercises: [], meals: [] } })
  return days
}

export default function PlayerDetailPage({ params }) {
  const { id } = use(params)
  const [player, setPlayer] = useState(null)
  const [profil, setProfil] = useState(null)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [creatingProgram, setCreatingProgram] = useState(false)
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [newProgramDescription, setNewProgramDescription] = useState('')

  useEffect(() => { fetchAll() }, [id])

  async function fetchAll() {
    const token = localStorage.getItem('admin_token')
    try {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      const userJson = await userRes.json()
      setPlayer(userJson.data)

      const progRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programmes?player_id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
      const progJson = await progRes.json()
      setPrograms(progJson.data || [])

      try {
        const profilRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/player/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (profilRes.ok) {
          const profilJson = await profilRes.json()
          setProfil(profilJson.data)
        }
      } catch (profilErr) {
        console.error('Profil non trouvé:', profilErr)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProgram(e) {
    e.preventDefault()
    if (!newProgramDescription.trim()) return
    setCreatingProgram(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ player_id: id, description: newProgramDescription.trim() }),
      })
      const json = await res.json()
      if (res.ok) {
        setPrograms(prev => [json.data, ...prev])
        setNewProgramDescription('')
        setShowNewProgramForm(false)
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setCreatingProgram(false)
    }
  }

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
  if (!player) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Joueur introuvable.</p>

  function PerformanceSection({ playerId }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchRecords() }, [playerId])

  async function fetchRecords() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/performance-records?player_id=${playerId}`, {
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

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
      <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>
        Performances
      </p>

      {loading ? (
        <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>Chargement...</p>
      ) : records.length === 0 ? (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>Aucune performance enregistrée.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {records.map(rec => (
            <div key={rec._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1A1A1A', border: '1px solid #262626', borderRadius: '8px', padding: '10px 14px' }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF', fontWeight: 600 }}>
                  {rec.label}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>
                  {new Date(rec.recorded_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#C8A84B', fontWeight: 700 }}>
                {rec.value}{rec.unit ? ` ${rec.unit}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '4px' }}>
        {player.name}
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888', marginBottom: '4px' }}>{player.email}</p>
      {profil?.phone && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888', marginBottom: '4px' }}>{profil.phone}</p>
      )}
      {(profil?.position || profil?.club) && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', marginBottom: '24px' }}>
          {[profil?.position, profil?.club].filter(Boolean).join(' · ')}
        </p>
      )}
      {!profil?.phone && !profil?.position && <div style={{ marginBottom: '24px' }} />}

      <SubscriptionSection playerId={id} />
      <PerformanceSection playerId={id} />

      
         

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF' }}>Programmes</p>
        {!showNewProgramForm && (
          <button onClick={() => setShowNewProgramForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', ...btnGold }}>
            <Plus size={13} /> Nouveau programme
          </button>
        )}
      </div>

      {showNewProgramForm && (
        <form onSubmit={handleCreateProgram} style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <label style={labelStyle}>Description du programme</label>
          <textarea
            autoFocus
            style={{ ...inputStyle, minHeight: '70px', fontSize: '13px', marginBottom: '12px' }}
            placeholder="ex: Programme de préparation physique - phase 1"
            value={newProgramDescription}
            onChange={e => setNewProgramDescription(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={creatingProgram} style={btnGold}>
              {creatingProgram ? 'Création...' : 'Créer'}
            </button>
            <button type="button" onClick={() => { setShowNewProgramForm(false); setNewProgramDescription('') }} style={btnOutline}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {programs.length === 0 ? (
        <p style={{ color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Aucun programme assigné.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {programs.map(prog => <ProgramCard key={prog._id} program={prog} />)}
        </div>
      )}
    </div>
  )
}

function SubscriptionSection({ playerId }) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [plan, setPlan] = useState('basic')
  const [months, setMonths] = useState(1)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSub() }, [playerId])

  async function fetchSub() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions?user_id=${playerId}&active=true`, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setSubscription(json.data?.[0] || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const endsAt = new Date()
      endsAt.setMonth(endsAt.getMonth() + Number(months))

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          user_id: playerId,
          plan_name: plan,
          price: PLAN_PRICES[plan],
          ends_at: endsAt.toISOString(),
        }),
      })
      if (res.ok) {
        setShowForm(false)
        fetchSub()
      } else {
        const json = await res.json()
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const daysLeft = subscription?.ends_at
    ? Math.max(0, Math.ceil((new Date(subscription.ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : null

  const selectStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '8px 10px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '12px', outline: 'none' }

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, color: '#FFF' }}>Abonnement</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={btnGold}>
            {subscription ? 'Renouveler' : 'Créer un abonnement'}
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>Chargement...</p>
      ) : subscription ? (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#AAA' }}>
          {PLAN_LABELS[subscription.plan_name] || subscription.plan_name} · {daysLeft} jours restants · expire le {new Date(subscription.ends_at).toLocaleDateString('fr-FR')}
        </p>
      ) : (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>Aucun abonnement actif.</p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
          <select style={selectStyle} value={plan} onChange={e => setPlan(e.target.value)}>
            {Object.entries(PLAN_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <input type="number" min="1" style={{ ...selectStyle, width: '70px' }} value={months} onChange={e => setMonths(e.target.value)} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>mois</span>
          <button type="submit" disabled={saving} style={btnGold}>
            {saving ? '...' : 'Valider'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} style={btnOutline}>
            Annuler
          </button>
        </form>
      )}
    </div>
  )
}

function ProgramCard({ program }) {
  const [entries, setEntries] = useState([])
  const [nutritionEntries, setNutritionEntries] = useState([])
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [showWeekForm, setShowWeekForm] = useState(false)
  const [restDays, setRestDays] = useState(program.rest_days || [])
  const [savingRest, setSavingRest] = useState(false)

  useEffect(() => { fetchEntries() }, [program._id])

  async function fetchEntries() {
    setLoadingEntries(true)
    try {
      const token = localStorage.getItem('admin_token')
      const [exRes, mealRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercice-programmes/${program._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/nutrition-programmes/${program._id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const exJson = await exRes.json()
      const mealJson = await mealRes.json()
      setEntries(exJson.data || [])
      setNutritionEntries(mealJson.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingEntries(false)
    }
  }

  async function toggleRestDay(day) {
    const updated = restDays.includes(day) ? restDays.filter(d => d !== day) : [...restDays, day]
    const previous = restDays
    setRestDays(updated)
    setSavingRest(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programmes/${program._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rest_days: updated }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setRestDays(previous)
        alert(json.message || 'Erreur lors de la sauvegarde des jours de repos')
      }
    } catch (err) {
      setRestDays(previous)
      alert('Erreur réseau')
    } finally {
      setSavingRest(false)
    }
  }

  async function handleRemoveExercice(entryId) {
    if (!confirm('Retirer cet exercice du programme ?')) return
    try {
      const token = localStorage.getItem('admin_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercice-programmes/${entryId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      fetchEntries()
    } catch (err) { alert('Erreur réseau') }
  }

  async function handleRemoveMeal(entryId) {
    if (!confirm('Retirer ce repas du programme ?')) return
    try {
      const token = localStorage.getItem('admin_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nutrition-programmes/${entryId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      fetchEntries()
    } catch (err) { alert('Erreur réseau') }
  }

  const existingWeeks = Array.from(new Set([
    ...entries.map(e => e.week_num),
    ...nutritionEntries.map(e => e.week_num),
  ])).sort((a, b) => a - b)

  const nextWeekNum = existingWeeks.length ? Math.max(...existingWeeks) + 1 : 1

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>{program.description || 'Programme sans titre'}</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>
            Créé le {new Date(program.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888', marginBottom: '8px' }}>Jours de repos hebdomadaires</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleRestDay(day)}
              disabled={savingRest}
              style={{
                width: '32px', height: '32px', borderRadius: '6px',
                background: restDays.includes(day) ? '#C8A84B' : '#1E1E1E',
                color: restDays.includes(day) ? '#000' : '#888',
                border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <FeedbackList programId={program._id} />

      {!showWeekForm && (
        <button onClick={() => setShowWeekForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', ...btnGold, marginBottom: '16px' }}>
          <Plus size={13} /> Nouvelle semaine
        </button>
      )}

      {showWeekForm && (
        <WeekForm
          program={program}
          defaultWeekNum={nextWeekNum}
          onCancel={() => setShowWeekForm(false)}
          onSaved={() => { setShowWeekForm(false); fetchEntries() }}
        />
      )}

      {loadingEntries ? (
        <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px', marginTop: '16px' }}>Chargement...</p>
      ) : existingWeeks.length === 0 ? (
        <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '13px', marginTop: '16px' }}>Aucune semaine renseignée pour le moment.</p>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {existingWeeks.map(week => (
            <WeekSummary
              key={week}
              week={week}
              exercises={entries.filter(e => e.week_num === week)}
              meals={nutritionEntries.filter(e => e.week_num === week)}
              onRemoveExercice={handleRemoveExercice}
              onRemoveMeal={handleRemoveMeal}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FeedbackList({ programId }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => { fetchFeedbacks() }, [programId])

  async function fetchFeedbacks() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session-feedback/${programId}`, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      setFeedbacks(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || feedbacks.length === 0) return null

  const visible = expanded ? feedbacks : feedbacks.slice(0, 3)

  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888', marginBottom: '8px' }}>
        <MessageCircle size={12} /> Retours du joueur ({feedbacks.length})
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {visible.map(fb => (
          <div key={fb._id} style={{ background: '#1A1A1A', border: '1px solid #262626', borderRadius: '8px', padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>
                S{fb.week_num} · J{fb.day_num} · {new Date(fb.created_at).toLocaleDateString('fr-FR')}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, color: FEELING_COLORS[fb.feeling] }}>
                {FEELING_LABELS[fb.feeling]}
              </span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#FFF', marginBottom: fb.comment ? '4px' : 0 }}>
              {LOAD_LABELS[fb.load_preference]}
            </p>
            {fb.comment && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#DDD', fontStyle: 'italic' }}>
                "{fb.comment}"
              </p>
            )}
          </div>
        ))}
      </div>
      {feedbacks.length > 3 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '11px', cursor: 'pointer', marginTop: '6px', padding: 0 }}
        >
          {expanded ? 'Voir moins' : `Voir les ${feedbacks.length - 3} autres`}
        </button>
      )}
    </div>
  )
}

function WeekSummary({ week, exercises, meals, onRemoveExercice, onRemoveMeal }) {
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedDays, setCollapsedDays] = useState(new Set())
  const days = Array.from(new Set([...exercises.map(e => e.day_num), ...meals.map(e => e.day_num)])).sort((a, b) => a - b)

  function toggleDay(day) {
    setCollapsedDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  return (
    <div style={{ background: '#181818', border: '1px solid #262626', borderRadius: '8px', padding: '16px' }}>
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginBottom: collapsed ? 0 : '12px' }}
      >
        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', color: '#FFF' }}>
          Semaine {week}
        </p>
        <span style={{ color: '#888', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>{collapsed ? 'Afficher ▾' : 'Cacher ▴'}</span>
      </button>

      {!collapsed && days.map(day => {
        const dayExercises = exercises.filter(e => e.day_num === day)
        const dayMeals = meals.filter(e => e.day_num === day)
        const isDayCollapsed = collapsedDays.has(day)

        return (
          <div key={day} style={{ marginBottom: '14px' }}>
            <button
              onClick={() => toggleDay(day)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: isDayCollapsed ? 0 : '6px' }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#FFF', fontWeight: 700, margin: 0 }}>Jour {day}</p>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>
                {isDayCollapsed ? 'Afficher ▾' : 'Cacher ▴'}
              </span>
            </button>

            {!isDayCollapsed && (
              <>
                {dayExercises.map(entry => (
                  <div key={entry._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <Dumbbell size={13} color="#FFF" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF', fontWeight: 600 }}>
                        {entry.name} {entry.complete && <Check size={12} color="#EEE" style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
                      </p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>
                        {[entry.sets ? `${entry.sets} séries` : null, entry.reps ? `${entry.reps} reps` : null, entry.rest ? `repos ${entry.rest}` : null].filter(Boolean).join(' · ')}
                      </p>
                      {entry.notes && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>{entry.notes}</p>}
                    </div>
                    <button onClick={() => onRemoveExercice(entry._id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', flexShrink: 0 }}><Trash2 size={12} /></button>
                  </div>
                ))}

                {dayMeals.map(entry => (
                  <div key={entry._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <Apple size={13} color="#AAA" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#AAA', fontWeight: 600 }}>{MEAL_LABELS[entry.meal_type]}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF' }}>{entry.content}</p>
                    </div>
                    <button onClick={() => onRemoveMeal(entry._id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', flexShrink: 0 }}><Trash2 size={12} /></button>
                  </div>
                ))}

                {dayExercises.length === 0 && dayMeals.length === 0 && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555' }}>Rien ce jour-là.</p>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function WeekForm({ program, defaultWeekNum, onCancel, onSaved }) {
  const [weekNum, setWeekNum] = useState(defaultWeekNum)
  const [days, setDays] = useState(emptyWeekDays())
  const [saving, setSaving] = useState(false)

  function addExerciseRow(day) {
    setDays(prev => ({ ...prev, [day]: { ...prev[day], exercises: [...prev[day].exercises, emptyExerciseRow()] } }))
  }
  function updateExerciseRow(day, idx, field, value) {
    setDays(prev => {
      const rows = [...prev[day].exercises]
      rows[idx] = { ...rows[idx], [field]: value }
      return { ...prev, [day]: { ...prev[day], exercises: rows } }
    })
  }
  function removeExerciseRow(day, idx) {
    setDays(prev => ({ ...prev, [day]: { ...prev[day], exercises: prev[day].exercises.filter((_, i) => i !== idx) } }))
  }

  function addMealRow(day) {
    setDays(prev => ({ ...prev, [day]: { ...prev[day], meals: [...prev[day].meals, emptyMealRow()] } }))
  }
  function updateMealRow(day, idx, field, value) {
    setDays(prev => {
      const rows = [...prev[day].meals]
      rows[idx] = { ...rows[idx], [field]: value }
      return { ...prev, [day]: { ...prev[day], meals: rows } }
    })
  }
  function removeMealRow(day, idx) {
    setDays(prev => ({ ...prev, [day]: { ...prev[day], meals: prev[day].meals.filter((_, i) => i !== idx) } }))
  }

  async function handleSave() {
    const token = localStorage.getItem('admin_token')
    const requests = []

    DAYS.forEach(day => {
      days[day].exercises.forEach(row => {
        if (!row.name.trim()) return
        requests.push(
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercice-programmes/${program._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              name: row.name.trim(),
              sets: row.sets ? Number(row.sets) : null,
              reps: row.reps || null,
              rest: row.rest || null,
              notes: row.notes || null,
              week_num: Number(weekNum),
              day_num: day,
            }),
          })
        )
      })
      days[day].meals.forEach(row => {
        if (!row.content.trim()) return
        requests.push(
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/nutrition-programmes/${program._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              meal_type: row.meal_type,
              content: row.content.trim(),
              week_num: Number(weekNum),
              day_num: day,
            }),
          })
        )
      })
    })

    if (requests.length === 0) {
      alert("Ajoute au moins un exercice ou un repas avant d'enregistrer.")
      return
    }

    setSaving(true)
    try {
      const responses = await Promise.all(requests)
      const failed = responses.filter(r => !r.ok)
      if (failed.length > 0) {
        alert(`${failed.length} entrée(s) n'ont pas pu être enregistrées.`)
      }
      onSaved()
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const totalRows = DAYS.reduce((acc, d) => acc + days[d].exercises.length + days[d].meals.length, 0)

  return (
    <div style={{ background: '#0F0F0F', border: '1px solid #262626', borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Semaine n°</label>
        <input
          type="number"
          min="1"
          style={{ ...inputStyle, width: '70px' }}
          value={weekNum}
          onChange={e => setWeekNum(e.target.value)}
        />
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>
          Remplis les jours dont tu as besoin, laisse les autres vides.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {DAYS.map(day => (
          <DayBlock
            key={day}
            day={day}
            exercises={days[day].exercises}
            meals={days[day].meals}
            onAddExercise={() => addExerciseRow(day)}
            onUpdateExercise={(idx, field, value) => updateExerciseRow(day, idx, field, value)}
            onRemoveExercise={(idx) => removeExerciseRow(day, idx)}
            onAddMeal={() => addMealRow(day)}
            onUpdateMeal={(idx, field, value) => updateMealRow(day, idx, field, value)}
            onRemoveMeal={(idx) => removeMealRow(day, idx)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #1E1E1E', flexWrap: 'wrap' }}>
        <button onClick={handleSave} disabled={saving} style={btnGold}>
          {saving ? 'Enregistrement...' : `Enregistrer la semaine${totalRows > 0 ? ` (${totalRows})` : ''}`}
        </button>
        <button onClick={onCancel} disabled={saving} style={btnOutline}>Annuler</button>
      </div>
    </div>
  )
}

function DayBlock({ day, exercises, meals, onAddExercise, onUpdateExercise, onRemoveExercise, onAddMeal, onUpdateMeal, onRemoveMeal }) {
  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '14px' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>Jour {day}</p>

      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#FFF', marginBottom: '8px' }}>
        <Dumbbell size={12} /> Exercices
      </p>

      {exercises.map((row, idx) => (
        <div key={idx} className="exerciseRow" style={{ display: 'grid', gridTemplateColumns: '2fr 70px 90px 80px 1fr auto', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
          <input style={inputStyle} placeholder="Nom (ex: Squat)" value={row.name} onChange={e => onUpdateExercise(idx, 'name', e.target.value)} />
          <input type="number" min="0" style={inputStyle} placeholder="Séries" value={row.sets} onChange={e => onUpdateExercise(idx, 'sets', e.target.value)} />
          <input style={inputStyle} placeholder="Reps" value={row.reps} onChange={e => onUpdateExercise(idx, 'reps', e.target.value)} />
          <input style={inputStyle} placeholder="Repos" value={row.rest} onChange={e => onUpdateExercise(idx, 'rest', e.target.value)} />
          <input style={inputStyle} placeholder="Notes" value={row.notes} onChange={e => onUpdateExercise(idx, 'notes', e.target.value)} />
          <button type="button" onClick={() => onRemoveExercise(idx)} className="rowDeleteBtn" style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={onAddExercise} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: '14px' }}>
        <Plus size={12} /> Ligne exercice
      </button>

      <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#AAA', marginBottom: '8px' }}>
        <Apple size={12} /> Nutrition
      </p>

      {meals.map((row, idx) => (
        <div key={idx} className="mealRow" style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
          <select style={inputStyle} value={row.meal_type} onChange={e => onUpdateMeal(idx, 'meal_type', e.target.value)}>
            {Object.entries(MEAL_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <input style={inputStyle} placeholder="ex: 3 œufs, avoine, banane..." value={row.content} onChange={e => onUpdateMeal(idx, 'content', e.target.value)} />
          <button type="button" onClick={() => onRemoveMeal(idx)} className="rowDeleteBtn" style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={onAddMeal} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', color: '#AAA', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', padding: '4px 0' }}>
        <Plus size={12} /> Ligne repas
      </button>

      <style jsx>{`
        @media (max-width: 700px) {
          .exerciseRow,
          .mealRow {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            padding: 10px;
            background: #1A1A1A;
            border-radius: 6px;
            margin-bottom: 10px !important;
          }
          .rowDeleteBtn {
            justify-self: flex-end;
          }
        }
      `}</style>
    </div>
  )
}