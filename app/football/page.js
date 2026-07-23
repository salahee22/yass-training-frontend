'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Filter, Clock, ChevronDown } from 'lucide-react'

const ageFilters = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior']
const themeFilters = ['Technique', 'Tactique', 'Physique', 'Mental', 'Nutrition']

export default function FootballPage() {
  const [allArticles, setAllArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAges, setSelectedAges] = useState([])
  const [selectedThemes, setSelectedThemes] = useState([])
  const [sortBy, setSortBy] = useState('nouveau')
  const [visibleCount, setVisibleCount] = useState(5)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`)
        const json = await res.json()
        setAllArticles(json.data || [])
      } catch (err) {
        console.error('Erreur fetch articles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const filtered = allArticles
    .filter(a => {
      const ageMatch = selectedAges.length === 0 || selectedAges.includes(a.age)
      const themeMatch = selectedThemes.length === 0 || selectedThemes.includes(a.category)
      return ageMatch && themeMatch
    })
    .sort((a, b) => {
      if (sortBy === 'a-z') return a.title.localeCompare(b.title)
      if (sortBy === 'z-a') return b.title.localeCompare(a.title)
      if (sortBy === 'nouveau') return new Date(b.published_at) - new Date(a.published_at)
      if (sortBy === 'ancien') return new Date(a.published_at) - new Date(b.published_at)
      return 0
    })

  const visible = filtered.slice(0, visibleCount)

  if (loading) {
    return (
      <div style={{ background: '#F1F1F1', paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555' }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#F1F1F1', paddingTop: '68px' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '70vh', minHeight: '500px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://res.cloudinary.com/imsyp8wq/image/upload/v1783517872/terrain2_ttm0ao.jpg")',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(50px, 8vw, 90px)', lineHeight: '0.95', color: '#FFFFFF', marginBottom: '20px' }}>
            Football<br /><span style={{ color: '#C8A84B' }}>Articles</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', lineHeight: '1.65', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', marginBottom: '32px' }}>
            Développez votre passion, améliorez votre niveau. Des articles rédigés par des entraîneurs certifiés.
          </p>
          <a href="#articles" className="btn-cyan">Découvrir les articles <ArrowRight size={14} /></a>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70px', background: 'linear-gradient(to top, #F1F1F1, transparent)' }} />
      </section>

      {/* RECENT — grille simple à 3 colonnes */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 60px', background: '#F1F1F1' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A84B', display: 'block', marginBottom: '10px' }}>À la une</span>
            <h2 className="title-xl" style={{ fontSize: 'clamp(30px, 4vw, 48px)', color: '#111' }}>Articles récents</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          {allArticles.slice(0, 3).map(article => (
            <ArticleCard key={article._id} article={article} featured />
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
          <span style={{ flex: 1, height: '1px', background: '#E0E0E0' }} />
          <span style={{ fontFamily: 'inter bold italic, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999' }}>Tous les articles</span>
          <span style={{ flex: 1, height: '1px', background: '#E0E0E0' }} />
        </div>
      </section>

      {/* FILTERS + ALL ARTICLES */}
      <section id="articles" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 100px', background: '#F1F1F1' }}>

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <MultiDropdown
            label="Age"
            options={ageFilters}
            selected={selectedAges}
            onChange={setSelectedAges}
          />
          <span style={{ color: '#DDDDDD' }}>|</span>
          <MultiDropdown
            label="Thème"
            options={themeFilters}
            selected={selectedThemes}
            onChange={setSelectedThemes}
          />
          <span style={{ color: '#DDDDDD' }}>|</span>
          <SortDropdown value={sortBy} onChange={setSortBy} />

          {(selectedAges.length > 0 || selectedThemes.length > 0) && (
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', marginLeft: '8px' }}>
              {filtered.length} article{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Articles grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#333', letterSpacing: '0.05em' }}>Aucun résultat</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555', marginTop: '8px' }}>Essayez d'autres filtres pour trouver des articles.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginBottom: '40px' }}>
              {visible.map(article => (
                <ArticleCard key={article._id} article={article} />
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


function ArticleCard({ article, featured }) {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <Link href={`/football/${article._id}`} style={{ textDecoration: 'none', display: 'block' }}>
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
        <div style={{ position: 'relative', height: featured ? '260px' : '220px', overflow: 'hidden' }}>
          <img
            src={article.image}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)'
          }} />

          <h3 style={{
            position: 'absolute', left: '20px', right: '20px', bottom: '52px',
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: featured ? '22px' : '18px',
            lineHeight: '1.25', color: '#FFFFFF',
            margin: 0,
          }}>
            {article.title}
          </h3>
        </div>

        <div style={{ padding: '20px 20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFFFFF' }}>{article.category}</span>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.6', color: '#AAA', marginBottom: '18px' }}>{article.summary?.slice(0, 95)}...</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Lire plus</span>
              <ArrowRight size={12} />
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#AAA' }}>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
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