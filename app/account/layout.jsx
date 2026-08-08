'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Dumbbell, TrendingUp, Settings, MessageCircle, LogOut, Calendar, Menu, X } from 'lucide-react'
import { RiWhatsappLine } from 'react-icons/ri'
import MessageBadge from '@/components/MessageBadge'

export default function AccountLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('player_token')
    const userStr = localStorage.getItem('player_user')

    if (!token || !userStr) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userStr))
    setChecking(false)

    async function fetchSub() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/me`, { headers: { Authorization: `Bearer ${token}` } })
        const json = await res.json()
        setSubscription(json.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSub()
  }, [pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Cache la navbar globale du site sur mobile pour ces pages (comme hide-footer-banner sur l'article)
  useEffect(() => {
    document.body.classList.add('hide-navbar-mobile')
    return () => document.body.classList.remove('hide-navbar-mobile')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('player_token')
    localStorage.removeItem('player_user')
    router.push('/login')
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <p style={{ color: '#AAA', fontFamily: 'Inter, sans-serif' }}>Vérification...</p>
      </div>
    )
  }

  const navItems = [
    { href: '/account', label: 'Vue d\'ensemble', icon: User },
    { href: '/account/programme', label: 'Mon programme', icon: Dumbbell },
    { href: '/account/performance', label: 'Mes performances', icon: TrendingUp },
    { href: '/account/messages', label: 'Messages', icon: MessageCircle },
    
    { href: '/account/bookings', label: 'Coaching présentiel', icon: Calendar },
    { href: '/account/settings', label: 'Paramètres', icon: Settings },
  ]

  const canContactWhatsApp = subscription && subscription.plan_name === 'elite'

  return (
    <div className="accountRoot" style={{ minHeight: '100vh', paddingTop: '68px', background: '#0A0A0A' }}>

      {/* TOPBAR MOBILE — remplace la navbar globale + sidebar sous 900px */}
      <div className="mobileTopbar" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: '#141414', borderBottom: '1px solid #1E1E1E', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 500 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
          {user?.name}
        </span>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', padding: '4px' }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }}
        />
      )}

      <div className="accountLayout" style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '32px' }}>

        <aside className={`accountSidebar${menuOpen ? ' open' : ''}`} style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', flex: 1 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>{user?.name}</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>{user?.email}</p>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="drawerCloseBtn"
              style={{ display: 'none', background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: '10px' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600,
                    color: active ? '#FFF' : '#888',
                    background: active ? '#1E1E1E' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                  {item.href === '/account/messages' && <MessageBadge tokenKey="player_token" />}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginTop: '12px', textAlign: 'left' }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </nav>
        </aside>

        <main className="accountMain" style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      {canContactWhatsApp && (
        <a href="https://wa.me/213561419431"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
            width: '52px', height: '52px', borderRadius: '50%',
            background: '#C8A84B', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)', textDecoration: 'none',
          }}
        >
          <RiWhatsappLine size={26} color="#000" />
        </a>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .mobileTopbar {
            display: flex !important;
          }
          .accountRoot {
            padding-top: 60px !important;
          }
          .accountLayout {
            padding-top: 20px !important;
            flex-direction: column;
          }
          .accountSidebar {
            position: fixed !important;
            top: 60px;
            left: 0;
            bottom: 0;
            width: 260px !important;
            background: #0A0A0A;
            padding: 20px 16px;
            z-index: 400;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
            overflow-y: auto;
          }
          .accountSidebar.open {
            transform: translateX(0);
          }
          .drawerCloseBtn {
            display: flex !important;
          }
          .accountMain {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}