'use client'
import { useEffect, useState } from 'react'
import { Check, Dumbbell, Apple } from 'lucide-react'

const MEAL_LABELS = {
  petit_dejeuner: 'Petit-déjeuner',
  collation_matin: 'Collation (matin)',
  dejeuner: 'Déjeuner',
  collation_apres_midi: 'Collation (après-midi)',
  diner: 'Dîner',
}

export default function ProgrammePage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrograms()
  }, [])

  async function fetchPrograms() {
    setLoading(true)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programmes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setPrograms(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Mon programme
      </h1>

      {programs.length === 0 ? (
        <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <Dumbbell size={28} color="#444" style={{ marginBottom: '12px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#888' }}>
            Aucun programme ne t'a encore été assigné. Ton coach te contactera bientôt.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {programs.map(program => (
            <ProgramView key={program._id} program={program} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProgramView({ program }) {
  const [entries, setEntries] = useState([])
  const [nutritionEntries, setNutritionEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [collapsedWeeks, setCollapsedWeeks] = useState(new Set())
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [collapsedDays, setCollapsedDays] = useState(new Set())

  function toggleDay(week, day) {
    const key = `${week}-${day}`
    setCollapsedDays(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  useEffect(() => {
    fetchAll()
  }, [program._id])

  async function fetchAll() {
    setLoading(true)
    try {
      const token = localStorage.getItem('player_token')
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
      setLoading(false)
    }
  }

  function toggleWeek(week) {
    setCollapsedWeeks(prev => {
      const next = new Set(prev)
      next.has(week) ? next.delete(week) : next.add(week)
      return next
    })
  }

  async function handleToggle(entry) {
    setTogglingId(entry._id)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercice-programmes/${entry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ complete: !entry.complete }),
      })
      if (res.ok) {
        const json = await res.json()
        setEntries(prev => prev.map(e => e._id === entry._id ? json.data : e))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleFinishDay(week, day, dayEntries) {
    const token = localStorage.getItem('player_token')
    const toComplete = dayEntries.filter(e => !e.complete)
    if (toComplete.length > 0) {
      try {
        const responses = await Promise.all(
          toComplete.map(entry =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercice-programmes/${entry._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ complete: true }),
            })
          )
        )
        const updatedEntries = await Promise.all(responses.map(r => r.json()))
        setEntries(prev => prev.map(e => {
          const match = updatedEntries.find(u => u.data?._id === e._id)
          return match ? match.data : e
        }))
      } catch (err) {
        console.error(err)
      }
    }
    setFeedbackModal({ week, day })
  }

  const groupedExercises = entries.reduce((acc, entry) => {
    const week = entry.week_num
    if (!acc[week]) acc[week] = {}
    if (!acc[week][entry.day_num]) acc[week][entry.day_num] = []
    acc[week][entry.day_num].push(entry)
    return acc
  }, {})

  const groupedMeals = nutritionEntries.reduce((acc, entry) => {
    const week = entry.week_num
    if (!acc[week]) acc[week] = {}
    if (!acc[week][entry.day_num]) acc[week][entry.day_num] = []
    acc[week][entry.day_num].push(entry)
    return acc
  }, {})

  const allWeeks = Array.from(new Set([
    ...Object.keys(groupedExercises).map(Number),
    ...Object.keys(groupedMeals).map(Number),
  ])).sort((a, b) => a - b)

  const completedCount = entries.filter(e => e.complete).length
  const progressPct = entries.length > 0 ? Math.round((completedCount / entries.length) * 100) : 0

  return (
    <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
            {program.description || 'Programme personnalisé'}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666' }}>
            Créé le {new Date(program.created_at).toLocaleDateString('fr-FR')}
            {program.coach_id?.name && ` · Coach: ${program.coach_id.name}`}
          </p>
        </div>
        {entries.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            {/* Reste en jaune : seule touche de couleur de la page */}
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 900, color: '#C8A84B' }}>{progressPct}%</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>{completedCount}/{entries.length} complétés</p>
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div style={{ height: '6px', background: '#1E1E1E', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
          {/* Jauge : reste en jaune */}
          <div style={{ height: '100%', width: `${progressPct}%`, background: '#C8A84B', transition: 'width 0.3s ease' }} />
        </div>
      )}

      {loading ? (
        <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Chargement...</p>
      ) : allWeeks.length === 0 ? (
        <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Aucun contenu dans ce programme pour le moment.</p>
      ) : (
        allWeeks.map(week => {
          const isCollapsed = collapsedWeeks.has(week)
          const weekExerciseDays = groupedExercises[week] || {}
          const weekMealDays = groupedMeals[week] || {}
          const days = Array.from(new Set([
            ...Object.keys(weekExerciseDays).map(Number),
            ...Object.keys(weekMealDays).map(Number),
          ])).sort((a, b) => a - b)

          return (
            <div key={week} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #1E1E1E' }}>
              <button
                onClick={() => toggleWeek(week)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: isCollapsed ? 0 : '16px' }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#FFF', fontWeight: 700 }}>Semaine {week}</p>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>
                  {isCollapsed ? 'Afficher ▾' : 'Cacher ▴'}
                </span>
              </button>

              {!isCollapsed && days.map(day => {
                const isRestDay = (program.rest_days || []).includes(day)
                const dayExercises = weekExerciseDays[day] || []
                const dayMeals = weekMealDays[day] || []
                const allComplete = dayExercises.length > 0 && dayExercises.every(e => e.complete)
                const dayKey = `${week}-${day}`
                const isDayCollapsed = collapsedDays.has(dayKey)

                return (
                  <div key={day} style={{ marginBottom: '18px' }}>
                    <button
                      onClick={() => toggleDay(week, day)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: isDayCollapsed ? 0 : '8px' }}
                    >
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#FFF', fontWeight: 700, margin: 0 }}>
                        Jour {day} {isRestDay && <span style={{ color: '#888', fontStyle: 'italic', fontWeight: 400 }}>· Repos</span>}
                      </p>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>
                        {isDayCollapsed ? 'Afficher ▾' : 'Cacher ▴'}
                      </span>
                    </button>

                    {!isDayCollapsed && (
                      isRestDay ? (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                          Jour de repos programmé.
                        </p>
                      ) : (
                        <>
                          {dayExercises.length > 0 && (
                            <>
                              <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>
                                <Dumbbell size={11} /> Exercices
                              </p>
                              {dayExercises.map(entry => (
                                <button
                                  key={entry._id}
                                  onClick={() => handleToggle(entry)}
                                  disabled={togglingId === entry._id}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                                    background: entry.complete ? '#1E1E1E' : '#1A1A1A',
                                    border: `1px solid ${entry.complete ? '#3A3A3A' : '#262626'}`,
                                    borderRadius: '8px', padding: '12px 14px', marginBottom: '6px',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                                  }}
                                >
                                  <div style={{
                                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                    border: `2px solid ${entry.complete ? '#666' : '#444'}`,
                                    background: entry.complete ? '#3A3A3A' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    {entry.complete && <Check size={12} color="#FFF" />}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: entry.complete ? '#888' : '#FFF' }}>
                                      {entry.name}
                                    </p>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666' }}>
                                      {[
                                        entry.sets ? `${entry.sets} séries` : null,
                                        entry.reps ? `${entry.reps} reps` : null,
                                        entry.rest ? `repos ${entry.rest}` : null,
                                      ].filter(Boolean).join(' · ')}
                                    </p>
                                    {entry.notes && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#555', marginTop: '2px' }}>{entry.notes}</p>}
                                  </div>
                                </button>
                              ))}

                              {allComplete ? (
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#FFF', fontWeight: 700, marginTop: '4px', marginBottom: '10px' }}>
                                  ✓ Journée terminée
                                </p>
                              ) : (
                                <button
                                  onClick={() => handleFinishDay(week, day, dayExercises)}
                                  style={{ background: '#1E1E1E', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, padding: '8px 14px', borderRadius: '6px', border: '1px solid #262626', cursor: 'pointer', marginTop: '6px', marginBottom: '10px' }}
                                >
                                  Marquer la journée comme terminée
                                </button>
                              )}
                            </>
                          )}

                          {dayMeals.length > 0 && (
                            <>
                              <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888', marginBottom: '6px', marginTop: '10px' }}>
                                <Apple size={11} /> Nutrition
                              </p>
                              {dayMeals.map(entry => (
                                <div key={entry._id} style={{ background: '#1A1A1A', border: '1px solid #262626', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px' }}>
                                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#AAA', fontWeight: 600, marginBottom: '2px' }}>
                                    {MEAL_LABELS[entry.meal_type]}
                                  </p>
                                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF' }}>{entry.content}</p>
                                </div>
                              ))}
                            </>
                          )}

                          {dayExercises.length === 0 && dayMeals.length === 0 && (
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555' }}>Rien ce jour-là.</p>
                          )}
                        </>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          )
        })
      )}

      {feedbackModal && (
        <FeedbackModal
          programId={program._id}
          week={feedbackModal.week}
          day={feedbackModal.day}
          onClose={() => setFeedbackModal(null)}
        />
      )}
    </div>
  )
}

function FeedbackModal({ programId, week, day, onClose }) {
  const [feeling, setFeeling] = useState('moyen')
  const [loadPref, setLoadPref] = useState('garder')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    setSaving(true)
    try {
      const token = localStorage.getItem('player_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ program_id: programId, week_num: week, day_num: day, feeling, load_preference: loadPref, comment: comment || null }),
      })
      onClose()
    } catch (err) {
      console.error(err)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const feelingOptions = [
    { value: 'fatigue', label: 'Fatigué' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'en_forme', label: 'En forme' },
  ]
  const loadOptions = [
    { value: 'baisser', label: 'Baisser la charge' },
    { value: 'garder', label: 'Garder pareil' },
    { value: 'augmenter', label: 'Augmenter la charge' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#141414', border: '1px solid #262626', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>Comment tu te sens ?</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginBottom: '18px' }}>Ton coach verra ce retour.</p>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '8px' }}>État général</p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {feelingOptions.map(opt => (
            <button key={opt.value} onClick={() => setFeeling(opt.value)} style={{ flex: 1, background: feeling === opt.value ? '#C8A84B' : '#1E1E1E', color: feeling === opt.value ? '#000' : '#AAA', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, padding: '8px 4px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
              {opt.label}
            </button>
          ))}
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '8px' }}>Charge d'entraînement</p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {loadOptions.map(opt => (
            <button key={opt.value} onClick={() => setLoadPref(opt.value)} style={{ flex: 1, background: loadPref === opt.value ? '#C8A84B' : '#1E1E1E', color: loadPref === opt.value ? '#000' : '#AAA', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, padding: '8px 4px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
              {opt.label}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Un commentaire pour ton coach (optionnel)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: '100%', minHeight: '70px', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSubmit} disabled={saving} style={{ flex: 1, background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            {saving ? 'Envoi...' : 'Envoyer'}
          </button>
          <button onClick={onClose} style={{ background: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '10px 16px', borderRadius: '6px', border: '1px solid #262626', cursor: 'pointer' }}>
            Passer
          </button>
        </div>
      </div>
    </div>
  )
}