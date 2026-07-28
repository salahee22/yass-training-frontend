'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Dumbbell, Users, ClipboardList, UserCog, MessageCircle, LogOut, Calendar, Menu, X } from 'lucide-react'
import MessageBadge from '@/components/MessageBadge'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const isLoginPage = pathname === '/dashboard/login'

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }
    const token = localStorage.getItem('admin_token')
    const userStr = localStorage.getItem('admin_user')

    if (!token || !userStr) {
      router.push('/dashboard/login')
      return
    }

    setUser(JSON.parse(userStr))
    setChecking(false)
  }, [pathname])

  // Ferme le menu à chaque changement de page
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/dashboard/login')
  }

  if (isLoginPage) return children

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <p style={{ color: '#AAA', fontFamily: 'Inter, sans-serif' }}>Vérification...</p>
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { href: '/dashboard/articles', label: 'Articles', icon: FileText },
    { href: '/dashboard/exercices', label: 'Exercices', icon: Dumbbell },
    { href: '/dashboard/coaches', label: 'Coachs', icon: Users },
    { href: '/dashboard/applications', label: 'Demandes Elite', icon: ClipboardList },
    { href: '/dashboard/players', label: 'Joueurs', icon: UserCog },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
    { href: '/dashboard/bookings', label: 'Réservations', icon: Calendar },
  ]

  return (
    <div className="dashRoot" style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex' }}>

      {/* TOPBAR MOBILE — visible uniquement sous 900px */}
      <div className="mobileTopbar" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: '#141414', borderBottom: '1px solid #1E1E1E', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 200 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '15px', color: '#FFF' }}>
          Yass Training <span style={{ color: '#C8A84B' }}>Admin</span>
        </span>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', padding: '4px' }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* OVERLAY — ferme le drawer au clic en dehors */}
      {menuOpen && (
        <div
          className="drawerOverlay"
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }}
        />
      )}

      {/* SIDEBAR — desktop: statique | mobile: drawer glissant */}
      <aside className={`dashSidebar${menuOpen ? ' open' : ''}`} style={{ width: '240px', background: '#141414', borderRight: '1px solid #1E1E1E', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', padding: '0 8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '18px', color: '#FFF' }}>
            Yass Training <span style={{ color: '#C8A84B' }}>Admin</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="drawerCloseBtn"
            style={{ display: 'none', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
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
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                {item.label}
                {item.href === '/dashboard/messages' && <MessageBadge tokenKey="admin_token" />}
              </Link>
            )
          })}
        </nav>

        <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '16px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', marginBottom: '10px', padding: '0 8px' }}>
            {user?.name}
          </p>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'none', border: 'none', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#E53935'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashMain" style={{ flex: 1, padding: '32px' }}>
        {children}
      </main>

      <style jsx>{`
        @media (max-width: 900px) {
          .mobileTopbar {
            display: flex !important;
          }
          .dashMain {
            padding: 80px 16px 24px !important;
          }
          .dashSidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 400;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            width: 260px !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          }
          .dashSidebar.open {
            transform: translateX(0);
          }
          .drawerCloseBtn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}