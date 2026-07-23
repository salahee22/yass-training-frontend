'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { RiInstagramLine, RiWhatsappLine } from 'react-icons/ri'
import FooterBanner from './FooterBanner'

export default function Footer() {
  return (
    <>
      <FooterBanner />

      <footer style={{ background: '#080808', borderTop: '1px solid #1E1E1E' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              {/* Logo — gauche */}
          
              <div style={{ width: '70px', height: '1px', background: '#FFFFFF', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.7', color: '#666', maxWidth: '260px' }}>
              Plateforme de référence pour la formation football en Algérie. Développement technique, tactique et mental pour tous les niveaux.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexDirection: 'column', alignItems: 'flex-start' }}>
              <p style={{ fontFamily: 'Syne', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#', marginBottom: '6px' }}>
                Follow us
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { Icon: RiInstagramLine, href: 'https://www.instagram.com/yasser_sshd/' },
                  { Icon: RiWhatsappLine, href: 'https://wa.me/213561419431' },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '34px', height: '34px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', transition: 'all 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#666' }}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontFamily: 'Syne', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '20px' }}>
              Navigation
            </p>
            {[
              { href: '/', label: 'Accueil' },
              { href: '/football', label: 'Football' },
              { href: '/training', label: 'Entraînement' },
              { href: '/elite', label: 'Elite' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{ display: 'block', fontFamily: 'Inter', fontSize: '13px', color: '#666', textDecoration: 'none', padding: '5px 0', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.target.style.color = '#FFFFFF'}
                onMouseLeave={e => e.target.style.color = '#666'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div>
            <p style={{ fontFamily: 'Syne', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '20px' }}>
              Catégories
            </p>
            {['U7 — U9', 'U11 — U13', 'U15 — U17', 'Senior', 'Gardiens', 'Élite'].map(cat => (
              <p key={cat} style={{ fontFamily: 'Inter', fontSize: '13px', color: '#666', padding: '5px 0' }}>
                {cat}
              </p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'Syne', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '20px' }}>
              Contact
            </p>
            {[
              { Icon: Mail, text: 'salaheddineyasser01@gmail.com' },
              { Icon: Phone, text: '+213 561 41 94 31' },
              { Icon: MapPin, text: 'Alger, Algérie' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
                <Icon size={13} color="#666" />
                <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#666' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#444' }}>
            © 2025 YASS TRAINING. Tous droits réservés.
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#333' }}>
            Conçu pour former les champions de demain
          </p>
        </div>
      </div>
      </footer>
    </>
  )
}
