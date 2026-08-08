'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const marqueeItems = ['Football', 'Formation', 'Elite', 'Technique', 'Tactique', 'Physique', 'Gardiens', 'U7 à Senior', 'Algérie', 'Performance']

const features = [
  { href: '/football', title: 'Contenus pédagogiques', desc: "Technique, tactique, physique, mental. Des articles écrits par des coaches certifiés.", label: 'Voir plus' },
  { href: '/training', title: 'Programmes d\'entraînement', desc: 'Entraînements structurés pour améliorer le contrôle, le jeu collectif et la prise de décision.', label: 'Découvrir' },
  { href: '/elite', title: 'Coaching Elite', desc: 'Suivi personnalisé, analyse vidéo et préparation physique pour les talents ambitieux.', label: 'Rejoindre' },
]

const heroSlides = [
  {
    id: 1,
    label: 'YASS TRAINING',
    title: 'Accompagner les stars de demain',
    desc: 'Articles, entraînements et coaching Elite.',
    cta: null,
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1600&q=80',
    tag: 'Yass Training',
  },
  {
    id: 2,
    label: 'NOS ARTICLES',
    title: 'Développez votre passion,\naméliorez votre niveau',
    desc: 'Des articles sur la technique, tactique et préparation physique.',
    cta: { label: 'Lire les articles ', href: '/football' },
    image: 'https://res.cloudinary.com/imsyp8wq/image/upload/v1783517872/terrain2_ttm0ao.jpg',
    tag: 'Football articles',
  },
  {
    id: 3,
    label: 'ENTRAÎNEMENTS',
    title: 'Programmes adaptés à votre niveau',
    desc: "Exercices structurés par âge, thème et objectif. Du U7 jusqu'au Senior.",
    cta: { label: 'Voir plus ', href: '/training' },
    image: 'https://res.cloudinary.com/imsyp8wq/image/upload/v1783517947/ball_hwpeer.jpg',
    tag: 'Entraînement',
  },
  {
    id: 4,
    label: 'PROGRAMME ELITE',
    title: 'Atteignez votre meilleur niveau',
    desc: "Coaching personnalisé, analyse vidéo, préparation physique. ",
    cta: { label: "Rejoindre l'Elite ", href: '/elite' },
    image: 'https://res.cloudinary.com/imsyp8wq/image/upload/v1783517999/cycle_zz5qc2.jpg',
    tag: 'Elite session',
  },
]

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  const goTo = (index) => {
    if (animating || index === current) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 700)
  }

  const slide = heroSlides[current]

  return (
    <section className="heroSection" style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>

      {/* BG images */}
      {heroSlides.map((s, i) => (
        <div key={s.id} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${s.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'opacity 0.7s ease',
          opacity: i === current ? 1 : 0,
          zIndex: 0,
          transform: s.id === 4 ? 'scaleX(-1)' : 'none',
        }} />
      ))}

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.3) 100%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="heroInner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Left */}
          <div className="heroLeft" style={{ maxWidth: '680px' }}>

            {/* Label */}
            <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '12px' }}>
              {slide.label}
            </span>

            {/* Ligne + cercle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '20px' }}>
              <div style={{ width: '70px', height: '1px', background: '#FFFFFF', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>
            </div>

            {/* Title */}
            <h1 key={`title-${current}`} className="heroTitle" style={{
              fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 800,
              fontSize: 'clamp(30px, 7vw, 42px)', lineHeight: '1.05',
              color: '#FFFFFF', marginBottom: '24px',
              animation: 'slideUp 0.6s ease forwards',
            }}>
              {slide.title.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block' }}>{line}</span>
              ))}
            </h1>

            {/* Desc */}
            <p key={`desc-${current}`} style={{
              fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '1.65',
              color: 'rgba(255,255,255,0.6)', maxWidth: '480px', marginBottom: '36px',
              animation: 'slideUp 0.7s ease forwards',
            }}>
              {slide.desc}
            </p>

            {/* CTA */}
            {slide.cta ? (
              <Link href={slide.cta.href} className="btn-cyan" style={{ fontSize: '13px', padding: '12px 24px' }}>
                {slide.cta.label} <ArrowRight size={15} />
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/football" className="btn-cyan" style={{ fontSize: '13px', padding: '12px 24px' }}>
                  Découvrir <ArrowRight size={15} />
                </Link>
                <Link href="/elite" className="btn-ghost" style={{ fontSize: '13px', padding: '12px 24px' }}>
                  Programme Elite
                </Link>
              </div>
            )}
          </div>

          {/* Right — slide list, caché sur mobile (les dots en bas suffisent) */}
          {/* Right — slide list, caché sur mobile (les dots en bas suffisent) */}
          <div className="heroSlideList">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 16px', textAlign: 'right',
                  fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  fontWeight: i === current ? 700 : 400,
                  color: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                  borderRight: i === current ? '3px solid #00C3D0' : '3px solid transparent',
                  transition: 'all 0.3s ease', lineHeight: '1.3',
                }}
                onMouseEnter={e => { if (i !== current) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={e => { if (i !== current) e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
              >
                {s.tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom dots */}
      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '28px' : '8px', height: '4px',
              borderRadius: '2px',
              background: i === current ? '#00C3D0' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .heroSlideList {
  display: flex;
  flex-direction: column;
}
@media (max-width: 900px) {
  .heroSlideList {
    display: none !important;
  }
  .heroInner {
    padding: 0 24px !important;
    justify-content: flex-start !important;
  }
}
        @media (max-width: 480px) {
          .heroSection {
            min-height: 560px !important;
          }
        }
      `}</style>
    </section>
  )
}

export default function HomePage() {
  const [articles, setArticles] = useState([])
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, exercisesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?limit=3`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices?limit=3`),
        ])
        const articlesJson = await articlesRes.json()
        const exercisesJson = await exercisesRes.json()
        setArticles(articlesJson.data || [])
        setExercises(exercisesJson.data || [])
      } catch (err) {
        console.error('Erreur fetch homepage:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{ background: '#FFFFFF' }}>

      <HeroSlider />

      {/* FEATURES */}
      <section style={{ background: '#0A0A0A', padding: '100px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '56px' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8A84B' }}>Ce qu'on propose</span>
            <h2 className="title-xl" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF' }}>
              Tout pour progresser
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '24px', alignItems: 'stretch' }}>
            {features.map((feat, i) => (
              <Link key={i} href={feat.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div
                  style={{
                    padding: '40px 32px', height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    background: '#1A1A1A', borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <h3 style={{ fontFamily: 'inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>{feat.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.65', color: '#999', marginBottom: '24px' }}>{feat.desc}</p>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8A84B', display: 'block' }}>{feat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT ARTICLES */}
      <section style={{ background: '#FFFFFF', padding: '100px 0', borderTop: '1px solid #E0E0E0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="title-xl" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: '#111' }}>Derniers articles</h2>
            </div>
            <Link href="/football" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          {articles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '24px', alignItems: 'stretch' }}>
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#999' }}>Aucun article pour l'instant.</p>
          )}
        </div>
      </section>

      {/* RECENT EXERCISES */}
      <section style={{ background: '#F1F1F1', padding: '100px 0', borderTop: '1px solid #E0E0E0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="title-xl" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: '#111' }}>Derniers entraînements</h2>
            </div>
            <Link href="/training" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          {exercises.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '24px', alignItems: 'stretch' }}>
              {exercises.map((ex) => (
                <ExerciseCard key={ex._id} exercise={ex} />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#999' }}>Aucun exercice pour l'instant.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A0A0A', padding: '120px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="title-xl" style={{ fontSize: 'clamp(40px, 6vw, 72px)', color: '#FFFFFF', marginBottom: '20px', marginTop: '16px' }}>
            Prêt à rejoindre<br /><span style={{ color: '#C8A84B' }}>l'Elite ?</span>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.5)', marginBottom: '36px' }}>
            Coaching personnalisé, analyse vidéo, préparation physique. Tout ce dont vous avez besoin.
          </p>
          <Link href="/elite" className="btn-gold" style={{ fontSize: '14px', padding: '14px 32px' }}>
            Voir les offres Elite <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function ArticleCard({ article }) {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <Link href={`/football/${article._id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
          borderRadius: '12px', background: '#141414',
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
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', pointerEvents: 'none' }} />
        </div>
        <div style={{ padding: '20px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFFFFF' }}>{article.category}</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#777' }}>{formattedDate}</span>
          </div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFFFFF', lineHeight: '1.4', marginBottom: '10px' }}>{article.title}</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.6', color: '#999', marginBottom: '16px' }}>{article.summary?.slice(0, 90)}...</p>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFFFFF' }}>Lire plus</span>
        </div>
      </div>
    </Link>
  )
}

function ExerciseCard({ exercise }) {
  return (
    <Link href={`/training/${exercise._id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
          borderRadius: '12px', background: '#141414',
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
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img src={exercise.image} alt={exercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', pointerEvents: 'none' }} />
        </div>
        <div style={{ padding: '20px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999999', display: 'block', marginBottom: '10px' }}>{exercise.theme}</span>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFFFFF', lineHeight: '1.4', marginBottom: '10px' }}>{exercise.name}</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.6', color: '#999', marginBottom: '16px' }}>{exercise.description?.slice(0, 90)}...</p>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFFFFF', marginTop: 'auto' }}>Voir l'entraînement</span>
        </div>
      </div>
    </Link>
  )
}