'use client'
import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, ChevronRight, Printer } from 'lucide-react'


const navSections = ['Description', 'Plan de la séance']

export default function ExercisePage({ params }) {
  const { id } = use(params)
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    async function fetchExercise() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices/${id}`)
        const json = await res.json() 
        setExercise(json.data)  
      } catch (err) {
        console.error('Erreur fetch exercice:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExercise()
  }, [id])

  useEffect(() => {
    document.body.classList.add('hide-footer-banner')
    return () => document.body.classList.remove('hide-footer-banner')
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const planEl = document.getElementById('section-plan')
      if (planEl) {
        const rect = planEl.getBoundingClientRect()
        if (rect.top <= 160) setActiveSection(1)
        else setActiveSection(0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (i) => {
    const el = document.getElementById(i === 0 ? 'section-desc' : 'section-plan')
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

  if (!exercise) {
    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#555' }}>Exercice introuvable.</p>
      </div>
    )
  }

  const content = {
  image: exercise.detail_image || exercise.image,
  sections: exercise.sections || [],
  planImages: exercise.planImages || [],
  organisation: exercise.organisation || { title: 'Organisation', items: [] },
  consignes: exercise.consignes || { title: 'Consignes', items: [] },
  roles: exercise.roles || { title: 'Rôle des entraîneurs', items: [] },
  categories: exercise.categories || [],
  subThemes: exercise.subThemes || [],
}

  return (
    <div style={{ background: '#FFFFFF', paddingTop: '68px', minHeight: '100vh' }}>

      {/* HERO — grid 3 images */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px' }}>
        {[exercise.image, 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'].map((img, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={img} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', pointerEvents: 'none' }} />
          </div>
        ))}
        <Link href="/training" style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', color: '#FFF', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '20px', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={13} /> Retour
        </Link>
      </div>
      {/* GALERIE PHOTOS */}
{exercise.images?.length > 0 && (
  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(exercise.images.length, 4)}, 1fr)`, gap: '12px' }}>
      {exercise.images.map((img, i) => (
        <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', height: '140px' }}>
          <img src={img} alt={`${exercise.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </div>
  </div>
)}

      {/* NAV */}
      <div style={{ borderBottom: '1px solid #E8E8E8', background: '#FAFAFA', position: 'sticky', top: '68px', zIndex: 100 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {navSections.map((s, i) => (
            <button key={i} onClick={() => scrollToSection(i)} style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: activeSection === i ? 600 : 400, color: activeSection === i ? '#111' : '#888', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 20px', borderBottom: activeSection === i ? '2px solid #111' : '2px solid transparent', transition: 'all 0.2s ease' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, fontStyle: 'italic', color: '#0A0A0A', lineHeight: '1.2', marginBottom: '20px' }}>
          {exercise.name}
        </h1>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F0F0F0', color: '#444', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '4px 12px', borderRadius: '3px' }}>
            <Clock size={11} /> {exercise.duration}
          </span>
          <span style={{ background: '#F0F0F0', color: '#444', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '4px 12px', borderRadius: '3px' }}>
            {exercise.theme}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F0F0F0', color: '#444', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '4px 12px', borderRadius: '3px' }}>
            <Users size={11} /> 6 à 11 joueurs
          </span>
        </div>

        <div id="section-desc">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.8', color: '#333', marginBottom: '32px' }}>
            {exercise.description}
          </p>

          <div style={{ marginBottom: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E8E8E8', maxWidth: '646px', marginLeft: 'auto', marginRight: 'auto' }}>
            <img
              src={content.image}
              alt={exercise.name}
              style={{
                width: '100%',
                aspectRatio: '646 / 444',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {content.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 800, fontStyle: 'italic', color: '#0A0A0A', marginBottom: '12px' }}>
                {sec.title}
              </h2>
              {sec.paragraphs.map((p, j) => (
                <p key={j} style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.75', color: '#444', marginBottom: '8px', fontStyle: 'italic' }}>{p}</p>
              ))}
            </div>
          ))}
        </div>

        {/* PLAN DE LA SÉANCE */}
        <div id="section-plan" style={{ marginTop: '48px' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 800, color: '#0A0A0A', marginBottom: '8px' }}>
            Plan de la seance
          </h2>
          <div style={{ width: '40px', height: '3px', background: '#C8A84B', marginBottom: '28px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '48px' }}>
            {content.planImages.map((item, i) => (
              <div key={i} style={{ border: '1px solid #E8E8E8', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img src={item.img} alt={`Plan ${item.id}`} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '2px 8px', borderRadius: '2px' }}>({item.id})</span>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#666', fontStyle: 'italic' }}>{item.caption}</p>
                </div>
              </div>
            ))}
          </div>

          <TextSection data={content.organisation} />
          <TextSection data={content.consignes} />
          <TextSection data={content.roles} />

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E8E8E8', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '8px' }}>Catégories</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {content.categories.map(c => (
                    <span key={c} style={{ background: '#F0F0F0', color: '#555', fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '3px 10px', borderRadius: '3px' }}>{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '8px' }}>Sous-thèmes</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {content.subThemes.map(t => (
                    <span key={t} style={{ background: '#F0F0F0', color: '#555', fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '3px 10px', borderRadius: '3px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0A0A0A', color: '#FFF', fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: '3px', border: 'none', cursor: 'pointer' }}
            >
              <Printer size={14} /> Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TextSection({ data }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 800, color: '#0A0A0A', marginBottom: '12px' }}>
        {data.title}
      </h3>
      <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
        {data.items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#444', marginBottom: '6px' }}>
            <span style={{ color: '#000000', flexShrink: 0, marginTop: '2px' }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}