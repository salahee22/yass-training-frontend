'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, Filter, Clock, Target, Package, ChevronDown, Zap } from 'lucide-react'
import Link from 'next/link'

const ageFilters = ['Tous', 'U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior']
const fieldThemes = ['Passe', 'Tir', 'Dribble', 'Conduite de balle', 'Contrôle', 'Jeu collectif', 'Vitesse', 'Endurance', 'Coordination']
const gkThemes = ['Prise de balle', 'Plongeons', 'Relance', 'Placement', 'Réflexes', 'Sorties aériennes']
const levelColors = { Débutant: '#4CAF50', Intermédiaire: '#C8A84B', Avancé: '#E53935' }

export default function TrainingPage() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAges, setSelectedAges] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [sortBy, setSortBy] = useState('nouveau')
  const [activeTab, setActiveTab] = useState('field')
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices`)
        const json = await res.json()
        setExercises(json.data || [])
      } catch (err) {
        console.error('Erreur fetch exercices:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  const allThemes = activeTab === 'field' ? fieldThemes : gkThemes

  const filtered = exercises
    .filter(e => {
      if (e.type !== activeTab) return false
      const ageMatch = selectedAges.length === 0 || selectedAges.includes(e.age)
      const themeMatch = selectedThemes.length === 0 || selectedThemes.includes(e.theme)
      return ageMatch && themeMatch
    })
    .sort((a, b) => {
      if (sortBy === 'a-z') return a.name.localeCompare(b.name)
      if (sortBy === 'z-a') return b.name.localeCompare(a.name)
      if (sortBy === 'nouveau') return new Date(b.published_at) - new Date(a.published_at)
      if (sortBy === 'ancien') return new Date(a.published_at) - new Date(b.published_at)
      return 0
    })

  const visible = filtered.slice(0, visibleCount)
  const featuredExercises = exercises.slice(0, 3)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedThemes([])
    setVisibleCount(6)
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555' }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingTop: '68px', paddingBottom: '60px', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '65vh', minHeight: '480px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://res.cloudinary.com/imsyp8wq/image/upload/v1783517947/ball_hwpeer.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: '82% ',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.9) contrast(1.05)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(40px, 8vw, 90px)', lineHeight: '0.95', color: '#FFFFFF', marginBottom: '20px' }}>
            ACCOMPAGNER <br /><span style={{ color: '#C8A84B' }}>LES STARS</span> <br /> DE DEMAIN
          </h1>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45px', background: 'linear-gradient(to top, #FFFFFF, transparent)' }} />
      </section>

      {/* Featured exercises */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 60px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A84B', display: 'block', marginBottom: '10px' }}>À la une</span>
            <h2 className="title-xl" style={{ fontSize: 'clamp(30px, 4vw, 48px)', color: '#111' }}>Entraînements récents</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          {featuredExercises.map((ex, index) => (
            <ExerciseCard key={ex._id} exercise={ex} levelColors={levelColors} featured={index === 0} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ flex: 1, height: '1px', background: '#E0E0E0' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999' }}>Tous les entraînements</span>
          <span style={{ flex: 1, height: '1px', background: '#E0E0E0' }} />
        </div>
      </section>

      {/* All training */}
      <section id="entrainements" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 0', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', gap: '0', border: '1px solid #E0E0E0', borderRadius: '10px', overflow: 'hidden', maxWidth: '400px', marginBottom: '48px' }}>
          {[
            { key: 'field', label: 'Joueurs' },
            { key: 'goalkeeper', label: 'Gardiens de But' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={{
                flex: 1, padding: '12px 16px',
                fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: activeTab === tab.key ? '#B0B0B0' : 'transparent',
                color: activeTab === tab.key ? '#000' : '#666',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <MultiDropdown
            label="Age"
            options={ageFilters.filter(f => f !== 'Tous')}
            selected={selectedAges}
            onChange={setSelectedAges}
          />
          <span style={{ color: '#DDDDDD' }}>|</span>
          <MultiDropdown
            label="Type"
            options={allThemes}
            selected={selectedThemes}
            onChange={setSelectedThemes}
          />
          <span style={{ color: '#DDDDDD' }}>|</span>
          <SortDropdown value={sortBy} onChange={setSortBy} />

          {(selectedAges.length > 0 || selectedThemes.length > 0) && (
            <>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', marginLeft: '8px' }}>
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => { setSelectedAges([]); setSelectedThemes([]) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8A84B' }}
              >
                Réinitialiser
              </button>
            </>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#333', letterSpacing: '0.05em' }}>Aucun exercice</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555', marginTop: '8px' }}>Essayez d&apos;autres filtres.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginBottom: '40px' }}>
              {visible.map(ex => (
                <ExerciseCard key={ex._id} exercise={ex} levelColors={levelColors} />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button onClick={() => setVisibleCount(v => v + 6)} className="btn-ghost" style={{ fontSize: '13px' }}>
                  Afficher plus <ChevronDown size={15} />
                </button>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#999', marginTop: '10px' }}>{visible.length} / {filtered.length}</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

function ExerciseCard({ exercise, levelColors, featured = false }) {
  return (
    <div
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: '12px',
        background: '#141414',
        boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ position: 'relative', height: featured ? '260px' : '190px', overflow: 'hidden' }}>
        <img src={exercise.image} alt={exercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }} />

        <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
          <span style={{
            background: 'rgba(30,30,30,0.9)',
            color: '#FFFFFF',
            fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px',
          }}>
            {exercise.age}
          </span>
        </div>
      </div>
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#FFFFFF', display: 'block', marginBottom: '6px',
          }}>{exercise.theme}</span>
        </div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>{exercise.name}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFF', marginTop: '6px', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#DDD', lineHeight: '1.4' }}>{exercise.objective}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#AAA', marginTop: '6px', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA' }}>{exercise.material}</span>
          </div>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#AAA', marginBottom: '16px', borderTop: '1px solid #1E1E1E', paddingTop: '12px' }}>{exercise.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF' }}>
          <Link href={`/training/${exercise._id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#FFFFFF' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Voir l&apos;entraînement</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function MultiDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const toggle = opt => selected.includes(opt) ? onChange(selected.filter(s => s !== opt)) : onChange([...selected, opt])
  const has = selected.length > 0

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#B0B0B0', color: '#0A0A0A', border: 'none', borderRadius: '24px', padding: '7px 16px', fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.color = '#FFFFFF' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#B0B0B0'; e.currentTarget.style.color = '#0A0A0A' }}
      >
        {has ? `${label} (${selected.length})` : label}
        <span style={{ fontSize: '8px', transform: open ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: '#13131A', border: '1px solid #24242E', borderRadius: '14px', padding: '6px', zIndex: 20, minWidth: '200px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', maxHeight: '280px', overflowY: 'auto' }}>
            {options.map(opt => {
              const checked = selected.includes(opt)
              return (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', background: 'transparent', color: '#E8E8ED', border: 'none', borderRadius: '8px', padding: '7px 8px', fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ width: '18px', height: '18px', flexShrink: 0, border: `2px solid ${checked ? '#FFFFFF' : '#6A6A78'}`, borderRadius: '5px', background: checked ? '#FFFFFF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {checked && <span style={{ color: '#0A0A0A', fontSize: '10px', fontWeight: 900 }}>✓</span>}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const opts = [{ key: 'nouveau', label: 'Plus récent' }, { key: 'ancien', label: 'Plus ancien' }, { key: 'a-z', label: 'A → Z' }, { key: 'z-a', label: 'Z → A' }]
  const current = opts.find(o => o.key === value)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#B0B0B0', color: '#0A0A0A', border: 'none', borderRadius: '24px', padding: '7px 16px', fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.color = '#FFFFFF' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#B0B0B0'; e.currentTarget.style.color = '#0A0A0A' }}
      >
        Trier par : {current.label} <span style={{ fontSize: '8px', transform: open ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: '#13131A', border: '1px solid #24242E', borderRadius: '14px', padding: '6px', zIndex: 20, minWidth: '180px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            {opts.map(opt => {
              const active = value === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => { onChange(opt.key); setOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', background: 'transparent', color: '#E8E8ED', border: 'none', borderRadius: '8px', padding: '7px 8px', fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ width: '18px', height: '18px', flexShrink: 0, border: `2px solid ${active ? '#FFFFFF' : '#6A6A78'}`, borderRadius: '50%', background: active ? '#FFFFFF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {active && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0A0A0A', display: 'block' }} />}
                  </span>
                  {opt.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}