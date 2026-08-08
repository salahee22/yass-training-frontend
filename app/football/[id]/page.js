'use client'
import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react'

export default function ArticlePage({ params }) {
  const { id } = use(params)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [otherArticles, setOtherArticles] = useState([])
  const [activeSection, setActiveSection] = useState(0)
  const [navFixed, setNavFixed] = useState(false)
  const [navHeight, setNavHeight] = useState(0)
  const navRef = useRef(null)
  const navOffsetTop = useRef(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const [articleRes, allRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`),
        ])
        const articleJson = await articleRes.json()
        const allJson = await allRes.json()

        setArticle(articleJson.data)
        setOtherArticles((allJson.data || []).filter(a => a._id !== id).slice(0, 2))
      } catch (err) {
        console.error('Erreur fetch article:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    document.body.classList.add('hide-footer-banner')
    return () => document.body.classList.remove('hide-footer-banner')
  }, [])

 useEffect(() => {
  if (!article) return
  const totalSections = (article.chapters?.length || 0) + 2

  const measureNav = () => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight)
      if (!navFixed) {
        navOffsetTop.current = navRef.current.getBoundingClientRect().top + window.scrollY
      }
    }
  }
  const t = setTimeout(measureNav, 50)

  const handleScroll = () => {
    for (let i = totalSections - 1; i >= 0; i--) {
      const el = document.getElementById(`section-${i}`)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 160) {
          setActiveSection(i)
          break
        }
      }
    }
    setNavFixed(window.scrollY >= navOffsetTop.current - 68)
  }

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', measureNav)
  return () => {
    clearTimeout(t)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', measureNav)
  }
}, [article])

  const scrollToSection = (i) => {
    const el = document.getElementById(`section-${i}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setActiveSection(i)
  }

  if (loading) {
    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555' }}>Chargement...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555' }}>Article introuvable.</p>
      </div>
    )
  }

  const content = {
    intro: article.intro?.paragraphs?.length
      ? article.intro
      : { label: 'INTRODUCTION', subtitle: article.summary, paragraphs: [article.content] },
    chapters: article.chapters || [],
    conclusion: article.conclusion?.title
      ? article.conclusion
      : { label: 'CONCLUSION', theme: '', title: '', paragraph: [] },
    sidebar: article.sidebar || { expert: null, parcours: null },
  }

  const sections = [
    'Intro',
    ...content.chapters.map((_, i) => `Chapitre ${i + 1}`),
    'Conclusion',
  ]

  return (
    <div style={{ background: '#FFFFFF', paddingTop: '68px', minHeight: '100vh' }}>

      {/* HERO IMAGE */}
      <div style={{ position: 'relative', height: 'clamp(280px, 48vw, 520px)', overflow: 'hidden' }}>
        <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))', pointerEvents: 'none' }} />
        <Link href="/football" style={{ position: 'absolute', top: '20px', left: '24px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.5)', color: '#FFF', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 14px', borderRadius: '20px', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={13} /> Retour
        </Link>
      </div>

      {/* GALERIE PHOTOS */}
      {article.images?.length > 0 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 0' }}>
          <div className="galleryGrid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(article.images.length, 4)}, 1fr)`, gap: '12px' }}>
            {article.images.map((img, i) => (
              <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', height: '140px' }}>
                <img src={img} alt={`${article.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NAV SECTIONS */}
{navFixed && <div style={{ height: `${navHeight}px` }} />}
<div
  ref={navRef}
  style={{
    borderBottom: '1px solid #E8E8E8',
    background: '#FAFAFA',
    position: navFixed ? 'fixed' : 'relative',
    top: navFixed ? '68px' : 'auto',
    left: 0,
    right: 0,
    zIndex: 100,
  }}
>
  <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
    {/* Desktop — tabs horizontales */}
    <div className="articleNavDesktop" style={{ display: 'flex' }}>
      {sections.map((s, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '13px',
            fontWeight: activeSection === i ? 600 : 400,
            color: activeSection === i ? '#111' : '#888',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '14px 20px',
            borderBottom: activeSection === i ? '2px solid #111' : '2px solid transparent',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap',
          }}
        >
          {s}
        </button>
      ))}
    </div>

    {/* Mobile — dropdown */}
    <div className="articleNavMobile" style={{ padding: '10px 0' }}>
      <div style={{ position: 'relative', maxWidth: '260px' }}>
        <select
          value={activeSection}
          onChange={e => scrollToSection(Number(e.target.value))}
          style={{
            width: '100%', appearance: 'none', WebkitAppearance: 'none',
            background: '#FFF', border: '1px solid #DDD', borderRadius: '8px',
            padding: '10px 36px 10px 14px', fontFamily: 'Inter, sans-serif',
            fontSize: '13px', fontWeight: 600, color: '#111', outline: 'none',
            cursor: 'pointer',
          }}
        >
          {sections.map((s, i) => (
            <option key={i} value={i}>{s}</option>
          ))}
        </select>
        <ChevronDown size={16} color="#888" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  </div>
</div>

      {/* TITLE + INTRO */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 0' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0A0A0A', lineHeight: '1.2', marginBottom: '32px' }}>
          {article.title}
        </h1>

        <div id="section-0" style={{ marginBottom: '16px' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8A84B', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {content.intro.label}
            <span style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
          </span>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 900, fontStyle: 'italic', color: '#0A0A0A', marginBottom: '20px', lineHeight: '1.3' }}>
            {content.intro.subtitle}
          </h2>
          {content.intro.paragraphs.map((p, i) => (
            <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.85', color: '#333', marginBottom: '16px' }}>{p}</p>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mainGrid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 48px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '60px', alignItems: 'stretch' }}>

        {/* LEFT */}
        <div style={{ minWidth: 0 }}>
          {content.chapters.map((ch, i) => (
            <div id={`section-${i + 1}`} key={i} style={{ marginBottom: '56px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#BBB', letterSpacing: '0.1em' }}>{ch.label}</span>
                <div style={{ height: '1px', background: '#E8E8E8', marginTop: '8px' }} />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8A84B', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                {ch.theme}
                <span style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
              </span>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 900, fontStyle: 'italic', color: '#0A0A0A', marginBottom: '20px', lineHeight: '1.2' }}>
                {ch.title}
              </h2>

              {i === 0 && ch.image ? (
                <>
                  <div className="floatImgWrap" style={{ overflow: 'hidden' }}>
                    <img
                      src={ch.image}
                      alt={ch.title}
                      className="floatImg"
                      style={{
                        float: 'right',
                        width: '260px',
                        height: '230px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        margin: '4px 0 20px 28px',
                      }}
                    />
                    {ch.paragraphs?.slice(0, 2).map((p, j) => (
                      <p key={j} style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.85', color: '#333', marginBottom: '16px' }}>{p}</p>
                    ))}
                  </div>
                  <div style={{ clear: 'both' }} />
                </>
              ) : (
                ch.paragraphs?.slice(0, 2).map((p, j) => (
                  <p key={j} style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.85', color: '#333', marginBottom: '16px' }}>{p}</p>
                ))
              )}

              {ch.quote && (
                <blockquote style={{ margin: '28px 0', padding: '20px 24px', borderLeft: '3px solid #C8A84B', background: '#FAFAFA', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontStyle: 'italic', color: '#333', lineHeight: '1.7' }}>
                  {ch.quote}
                </blockquote>
              )}

              {i !== 0 && ch.image && (
                <div style={{ margin: '28px 0', borderRadius: '8px', overflow: 'hidden', background: '#F5F5F5', minHeight: '200px' }}>
                  <img
                    src={ch.image}
                    alt={ch.title}
                    style={{ width: '100%', height: 'clamp(200px, 40vw, 320px)', objectFit: 'cover', display: 'block', objectPosition: 'center' }}
                  />
                </div>
              )}

              {ch.paragraphs?.slice(2).map((p, j) => (
                <p key={j} style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.85', color: '#333', marginBottom: '16px' }}>{p}</p>
              ))}
            </div>
          ))}

          {/* CONCLUSION */}
          {content.conclusion.title && (
            <div id={`section-${content.chapters.length + 1}`} style={{ marginBottom: '0' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#BBB', letterSpacing: '0.1em' }}>{content.conclusion.label}</span>
                <div style={{ height: '1px', background: '#E8E8E8', marginTop: '8px' }} />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8A84B', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                {content.conclusion.theme}
                <span style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
              </span>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 900, fontStyle: 'italic', color: '#0A0A0A', marginBottom: '20px' }}>
                {content.conclusion.title}
              </h2>
              {content.conclusion.paragraph?.map((p, i) => (
                <p key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.85', color: '#333', marginBottom: '16px' }}>{p}</p>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '28px', minHeight: '100%', paddingTop: '22px' }}>

          {content.sidebar.parcours?.items?.length > 0 && (
            <div style={{ paddingBottom: '32px', borderBottom: '1px solid #E8E8E8' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111', marginBottom: '20px' }}>
                {content.sidebar.parcours.title}
              </p>
              {content.sidebar.parcours.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, color: '#C8A84B', flexShrink: 0, paddingTop: '2px' }}>{item.year}</span>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#555' }}>{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {content.sidebar.expert?.name && (
            <div style={{ background: '#0A0A0A', padding: '24px', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 900, fontStyle: 'italic', color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>
                {content.sidebar.expert.name}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.65', color: '#888', marginBottom: '20px', fontStyle: 'italic' }}>
                {content.sidebar.expert.description}
              </p>
            </div>
          )}

          {content.sidebar.expert?.name && content.sidebar.expert?.keyFigures?.length > 0 && (
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid #E8E8E8' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111', marginBottom: '16px' }}>
                Chiffres clés
              </p>
              {content.sidebar.expert.keyFigures.map((kf, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ color: '#C8A84B', fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>—</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', lineHeight: '1.5' }}>
                    {kf.value && <strong style={{ color: '#111' }}>{kf.value}</strong>} {kf.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ flex: 1 }} />

          {otherArticles.length > 0 && (
        <div>
    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', fontWeight: 800, fontStyle: 'italic', color: '#0A0A0A', marginBottom: '10px' }}>
      Autres contenus
    </h3>
    <div style={{ width: '70px', height: '1px', background: '#0A0A0A', position: 'relative', marginBottom: '20px' }}>
      <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#0A0A0A' }} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {otherArticles.map(a => (
        <Link key={a._id} href={`/football/${a._id}`} style={{ display: 'block', borderRadius: '6px', overflow: 'hidden' }}>
          <img src={a.image} alt={a.title} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
        </Link>
      ))}
    </div>
      </div>
    )} 

          <Link
            href="/elite"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#C8A84B', padding: '16px 20px', borderRadius: '4px', textDecoration: 'none', transition: 'background 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E8C86A'}
            onMouseLeave={e => e.currentTarget.style.background = '#C8A84B'}
          >
            <div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000', marginBottom: '2px' }}>Programme Elite</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(0,0,0,0.6)' }}>Coaching personnalisé</p>
            </div>
            <ChevronRight size={18} color="#000" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .mainGrid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 640px) {
          .galleryGrid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .floatImg {
            float: none !important;
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16 / 10;
            margin: 0 0 16px 0 !important;
          }
        }
          .articleNavMobile { display: none; }
@media (max-width: 640px) {
  .articleNavDesktop { display: none !important; }
  .articleNavMobile { display: block !important; }
}
      `}</style>
    </div>
  )
}