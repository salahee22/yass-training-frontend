'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, Check, Star } from 'lucide-react'

const offers = [
  {
    id: 'elite1',
    name: 'Elite 1',
    subtitle: 'Démarrage',
    price: '4 500',
    period: 'DA / mois',
    features: [
      'Programme personnalisé',
      'Analyse joueur initiale',
      'Exercices techniques hebdo',
      'Suivi mensuel',
      'Accès bibliothèque exercices',
      'Support par message',
    ],
  },
  {
    id: 'elite2',
    name: 'Elite 2',
    subtitle: 'Performance',
    price: '8 500',
    period: 'DA / mois',
    features: [
      'Tout Elite 1 inclus',
      'Suivi hebdomadaire avancé',
      'Préparation physique dédiée',
      'Analyse vidéo mensuelle',
      'Rapport de progression',
      'Accès coach prioritaire',
    ],
  },
  {
    id: 'elite3',
    name: 'Elite 3',
    subtitle: 'Professionnel',
    price: '14 000',
    period: 'DA / mois',
    features: [
      'Tout Elite 2 inclus',
      'Coaching individuel (4x/mois)',
      'Plan complet sur mesure',
      'Suivi professionnel continu',
      'Analyse vidéo chaque semaine',
      'Accès direct au staff Elite',
    ],
  },
]

const positions = ['Attaquant', 'Milieu de terrain', 'Défenseur', 'Gardien de but', 'Polyvalent']
const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Semi-professionnel']

export default function ElitePage() {
  const [coaches, setCoaches] = useState([])
  const [selectedOffer, setSelectedOffer] = useState('')
  const [form, setForm] = useState({
    nom: '', prenom: '', age: '', poste: '', niveau: '',
    club: '', telephone: '', email: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCoaches() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coaches`)
        const json = await res.json()
        setCoaches(json.data || [])
      } catch (err) {
        console.error('Erreur fetch coaches:', err)
      }
    }
    fetchCoaches()
  }, [])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elite-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age), offre: selectedOffer }),
      })
      const json = await res.json()

      if (!res.ok) {
  setError(json.errors?.map(e => e.message).join(', ') || json.message || 'Erreur lors de l\'envoi')
  return
}

// Redirige vers la page de paiement Chargily
window.location.href = json.data.checkout_url
    } catch (err) {
      setError('Erreur réseau, réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#0A0A0A', paddingTop: '68px' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '80vh', minHeight: '550px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://res.cloudinary.com/imsyp8wq/image/upload/v1783517999/cycle_zz5qc2.jpg)', backgroundSize: 'cover', backgroundPosition: '82% 5%', backgroundRepeat: 'no-repeat', transform: 'scaleX(-1)', pointerEvents:'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.65) 60%, rgba(30,20,0,0.4) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(40px, 10vw, 100px)', lineHeight: '1', color: '#FFFFFF', marginBottom: '24px' }}>
           Programme<br /><span style={{ color: '#C8A84B' }}>ELITE</span>
         </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', lineHeight: '1.7', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', marginBottom: '40px' }}>
            Atteignez votre meilleur niveau. Un coaching d'exception réservé aux joueurs qui veulent franchir un cap décisif.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => document.getElementById('offres')?.scrollIntoView({ behavior: 'smooth' })} className="btn-gold" style={{ padding: '13px 28px', fontSize: '14px' }}>
              Voir les offres <ArrowRight size={15} />
            </button>
            <button onClick={() => document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost" style={{ padding: '13px 28px', fontSize: '14px' }}>
              S'inscrire maintenant
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #0A0A0A, transparent)' , pointerEvents:'none'}} />
      </section>

      {/* POURQUOI NOUS */}
      <section style={{ background: '#0A0A0A', borderTop: '1px solid #1A1A1A' }}>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 60px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '480px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 600, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', display: 'flex', marginBottom: '16px', marginTop: '-8px', paddingLeft: '7px' }}>Pourquoi Nous</span>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, fontStyle: 'italic', color: '#FFFFFF', lineHeight: '1.1', textTransform: 'uppercase', marginBottom: '0' }}>
              L'EXCELLENCE COMME<br />
              <span style={{ color: '#C8A84B' }}>STANDARD.</span>
            </h2>
          </div>
          <div style={{ maxWidth: '340px', paddingTop: '26px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#888', fontStyle: 'italic' }}>
              Une approche scientifique de l'entraînement. Conçu pour ceux qui exigent la précision cinétique et des résultats mesurables.
            </p>
          </div>
        </div>

        <div className="whyUsGrid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
          {[
            {
              title: 'Individualisation',
              desc: 'Chaque joueur est unique, nos contenus s\'adaptent à son niveau, son poste et ses objectifs.',
              active: false,
            },
            {
              title: 'Expertise',
              desc: 'Des séances construites avec rigueur, inspirées des méthodes professionnelles.',
              active: false,
            },
            {
              title: 'Progression continue',
              desc: 'Un suivi structuré pour garantir une évolution réelle et mesurable.',
              active: false,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="whyUsItem"
              style={{
                padding: '48px 36px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#1E1E1E',
                borderLeftWidth: i === 0 ? '1px' : '0',
                borderLeftStyle: i === 0 ? 'solid' : 'none',
                borderLeftColor: i === 0 ? '#1E1E1E' : 'transparent',
                background: item.active ? '#111' : 'transparent',
                borderTopWidth: item.active ? '2px' : '1px',
                borderTopStyle: 'solid',
                borderTopColor: item.active ? '#C8A84B' : '#1E1E1E',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#111'
                e.currentTarget.style.borderTopColor = '#FFFFFF'
                e.currentTarget.style.borderTopWidth = '2px'
              }}
              onMouseLeave={e => {
                if (!item.active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderTopColor = '#1E1E1E'
                  e.currentTarget.style.borderTopWidth = '1px'
                }
              }}
            >
              <h3 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px', fontWeight: 800,
                fontStyle: 'italic',
                color: item.active ? '#C8A84B' : '#FFFFFF',
                marginBottom: '16px',
                textTransform: 'none',
              }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.7', color: '#666' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COACHES HEADER */}
      <section style={{ background: '#F5F5F5', padding: '80px 24px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap', paddingBottom: '48px', borderBottom: '1px solid #E0E0E0' }}>
          <div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 600, color: '#333', fontStyle: 'italic', display: 'flex', marginBottom: '16px', marginTop: '-8px', paddingLeft: '7px' }}>Nos coachs</span>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, fontStyle: 'italic', color: '#111', lineHeight: '1.1', textTransform: 'uppercase' }}>
              DES ENTRAÎNEURS QUALIFIÉS<br />
              <span style={{ color: '#C8A84B' }}>FORMÉS et Certifiés.</span>
            </h2>
          </div>
          <div style={{ maxWidth: '340px', paddingTop: '26px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '1.7', color: '#666', fontStyle: 'italic' }}>
              Chaque séance est pensée pour optimiser la progression, corriger les détails et développer le potentiel individuel.
            </p>
          </div>
        </div>
      </section>

      {/* COACHES */}
      <section style={{ background: '#F5F5F5', padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {coaches.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '20px', paddingTop: '48px' }}>
              {coaches.map(coach => (
                <CoachCardLight key={coach._id} coach={coach} />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#999', paddingTop: '48px' }}>Chargement des coachs...</p>
          )}
        </div>
      </section>

      {/* OFFERS */}
      <section id="offres" style={{ background: '#F5F5F5', padding: '100px 0 60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: '#111111' }}>
              Commencer avec nous
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: '14px', color: '#777', marginTop: '10px' }}>
              choisissez le pack qui correspond à vos ambitions.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '24px', alignItems: 'start' }}>
            {offers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSelected={selectedOffer === offer.id}
                onSelect={() => setSelectedOffer(offer.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="inscription" style={{ background: '#F5F5F5', padding: '60px 0 100px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: '#111111' }}>
              Informations personnelles
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontStyle: 'italic', color: '#777', marginTop: '10px' }}>
              Remplissez le formulaire afin que nous puissions vous contacter.
            </p>
          </div>

          {submitted ? (
            <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(0,195,208,0.1)', border: '2px solid #00C3D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Check size={28} color="#00C3D0" />
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 800, fontSize: '28px', color: '#111111', marginBottom: '12px' }}>Demande envoyée !</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#777' }}>Notre équipe vous contactera sous 48h. Bienvenue dans le programme Elite.</p>
              <button onClick={() => { setSubmitted(false); setSelectedOffer(''); setForm({ nom: '', prenom: '', age: '', poste: '', niveau: '', club: '', telephone: '', email: '', message: '' }) }} style={{ marginTop: '24px', background: 'none', border: '1px solid #DDDDDD', color: '#777', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', padding: '10px 20px', borderRadius: '24px', cursor: 'pointer' }}>
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ background: '#EDEDED', borderRadius: '16px', padding: '32px 24px' }}>

                {error && (
                  <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>
                    {error}
                  </p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '20px', marginBottom: '20px' }}>
                  {[
                    { name: 'nom', label: 'Nom', type: 'text', required: true },
                    { name: 'prenom', label: 'Prenom', type: 'text', required: true },
                    { name: 'age', label: 'Age', type: 'number', required: true },
                    { name: 'telephone', label: 'Numéro de téléphone', type: 'tel', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'club', label: 'Ton poste', type: 'text', required: false },
                  ].map(field => (
                    <FormField key={field.name} field={field} value={form[field.name]} onChange={handleChange} />
                  ))}

                  {/* Poste */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#222222', marginBottom: '8px' }}>Poste</label>
                    <select name="poste" value={form.poste} onChange={handleChange} required style={{ width: '100%', background: '#E4E4E4', border: 'none', borderRadius: '8px', padding: '12px 14px', color: form.poste ? '#222' : '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                      <option value="">Sélectionner...</option>
                      {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Niveau */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#222222', marginBottom: '8px' }}>Niveau actuel</label>
                    <select name="niveau" value={form.niveau} onChange={handleChange} required style={{ width: '100%', background: '#E4E4E4', border: 'none', borderRadius: '8px', padding: '12px 14px', color: form.niveau ? '#222' : '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                      <option value="">Sélectionner...</option>
                      {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  {/* Offre */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#222222', marginBottom: '8px' }}>Ton objectif</label>
                    <select
                      name="offre"
                      value={selectedOffer}
                      onChange={e => setSelectedOffer(e.target.value)}
                      required
                      style={{ width: '100%', background: '#E4E4E4', border: 'none', borderRadius: '8px', padding: '12px 14px', color: selectedOffer ? '#222' : '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Sélectionner...</option>
                      {offers.map(o => <option key={o.id} value={o.id}>{o.name} — {o.price} {o.period}</option>)}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#222222', marginBottom: '8px' }}>Informations médicales</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Parlez-nous de vos objectifs, vos ambitions..."
                    style={{ width: '100%', background: '#E4E4E4', border: 'none', borderRadius: '8px', padding: '12px 14px', color: '#222', fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.6', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: '#00C3D0', color: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px',
                      padding: '12px 26px', borderRadius: '24px', border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.6 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {submitting ? 'Envoi...' : <>Envoyer <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 700px) {
          .whyUsGrid {
            grid-template-columns: 1fr !important;
          }
          .whyUsItem {
            border-left-width: 1px !important;
            border-left-style: solid !important;
            border-left-color: #1E1E1E !important;
          }
        }
      `}</style>
    </div>
  )
}

function OfferCard({ offer, isSelected, onSelect }) {
  return (
    <div
      style={{
        background: isSelected ? '#111111' : '#FFFFFF',
        borderRadius: '16px',
        padding: '36px 28px',
        position: 'relative',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 12px 32px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.14)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
    >
      <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontStyle: 'italic', fontSize: '22px', color: isSelected ? '#FFFFFF' : '#111111', marginBottom: '16px' }}>
        {offer.name}
      </h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontStyle: 'italic', fontSize: '26px', color: isSelected ? '#FFFFFF' : '#111111' }}>{offer.price}</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: isSelected ? 'rgba(255,255,255,0.5)' : '#999999' }}>{offer.period}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {offer.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Check size={13} color="#00C3D0" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: isSelected ? 'rgba(255,255,255,0.75)' : '#555555', lineHeight: '1.4' }}>{f}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => { onSelect(); setTimeout(() => document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' }), 50) }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          width: '100%',
          background: isSelected ? '#00C3D0' : 'transparent',
          color: isSelected ? '#000000' : '#00C3D0',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px',
          padding: '13px', borderRadius: '24px',
          border: '2px solid #00C3D0',
          cursor: 'pointer', transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = '#00C3D0'; e.currentTarget.style.color = '#000000' } }}
        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00C3D0' } }}
      >
        {isSelected ? <><Check size={14} /> Sélectionné</> : <>Commencer <ArrowRight size={14} /></>}
      </button>
    </div>
  )
}

function FormField({ field, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#222222', marginBottom: '8px' }}>
        {field.label}
      </label>
      <input
        type={field.type}
        name={field.name}
        value={value}
        onChange={onChange}
        required={field.required}
        style={{ width: '100%', background: '#E4E4E4', border: 'none', borderRadius: '8px', padding: '12px 14px', color: '#222', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }}
      />
    </div>
  )
}

function CoachCardLight({ coach }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E8E8E8',
      borderRadius: '4px',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Photo */}
      <div style={{
        height: '260px',
        background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {coach.image ? (
          <img
            src={coach.image}
            alt={coach.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : null}
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 800, fontStyle: 'italic', color: '#111', marginBottom: '6px' }}>{coach.name}</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', lineHeight: '1.5', marginBottom: '12px' }}>{coach.specialite}</p>
        {coach.diplomes && (
          <span style={{
            display: 'inline-block',
            background: '#1A1A1A', color: '#FFFFFF',
            fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: '3px',
          }}>
            {coach.diplomes}
          </span>
        )}
      </div>
    </div>
  )
}