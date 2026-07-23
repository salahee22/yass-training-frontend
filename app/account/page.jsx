'use client'
import { useEffect, useState } from 'react'
import { Pencil, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function AccountHome() {
  const [profil, setProfil] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
      const token = localStorage.getItem('player_token')
      try {
        const [profilRes, subRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/me`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (profilRes.ok) {
          const profilJson = await profilRes.json()
          setProfil(profilJson.data)
        }

        const subJson = await subRes.json()
        setSubscription(subJson.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>

  const daysLeft = subscription?.ends_at
    ? Math.max(0, Math.ceil((new Date(subscription.ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Vue d'ensemble
      </h1>

      {/* Abonnement */}
      <div style={{ background: subscription ? 'linear-gradient(135deg, #C8A84B 0%, #E8C86A 100%)' : '#141414', border: subscription ? 'none' : '1px solid #1E1E1E', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        {subscription ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CreditCard size={16} color="#000" />
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#000' }}>
                Abonnement {subscription.plan_name}
              </span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(0,0,0,0.7)' }}>
              {daysLeft > 0 ? `${daysLeft} jours restants` : 'Expiré'} · jusqu'au {new Date(subscription.ends_at).toLocaleDateString('fr-FR')}
            </p>
          </>
        ) : (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>Aucun abonnement actif.</p>
        )}
      </div>

      {/* Profil */}
      <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888' }}>
            Mon profil
          </p>
          <Link href="/account/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '12px', textDecoration: 'none' }}>
            <Pencil size={13} /> Modifier
          </Link>
        </div>

        {profil ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Poste" value={profil.position} />
            <Field label="Club" value={profil.club} />
            <Field label="Taille" value={profil.height ? `${profil.height} cm` : null} />
            <Field label="Poids" value={profil.weight ? `${profil.weight} kg` : null} />
          </div>
        ) : (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>
            Profil non complété. <Link href="/account/profile" style={{ color: '#C8A84B' }}>Compléter maintenant</Link>
          </p>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#FFF' }}>{value || '—'}</p>
    </div>
  )
}