'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function FooterBanner() {
  const pathname = usePathname()

  // Cache le banner sur l'accueil, la page Elite et les pages article
  if (pathname === '/' || pathname === '/elite' || pathname.startsWith('/football/') || pathname.startsWith('/training/')) return null

  return (
    <div style={{
      background: '#C8A84B',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div>
        <p style={{ fontFamily: 'Bebas Neue', fontSize: '22px', color: '#000', letterSpacing: '0.05em' }}>
          Prêt à passer au niveau supérieur ?
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'rgba(0,0,0,0.7)' }}>
          Rejoignez des centaines de jeunes talents formés par YASS TRAINING
        </p>
      </div>
      <Link
        href="/elite"
        style={{
          background: '#000', color: '#C8A84B',
          fontFamily: 'Syne', fontSize: '13px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '10px 24px', borderRadius: '3px',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}
      >
        Rejoindre l'Elite →
      </Link>
    </div>
  )
}