'use client'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function MerciPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(76,175,80,0.15)', border: '2px solid #4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Check size={28} color="#4CAF50" />
        </div>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
          Paiement confirmé !
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#888', marginBottom: '28px' }}>
          Ton compte est en cours de création. Tu recevras tes identifiants de connexion sous peu.
        </p>
        <Link href="/login" className="btn-cyan" style={{ fontSize: '13px', padding: '12px 24px' }}>
          Aller à la connexion
        </Link>
      </div>
    </div>
  )
}