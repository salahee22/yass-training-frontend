'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, FileText, Dumbbell,Users,ClipboardList,UserCog,  LogOut } from 'lucide-react'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)

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
  { href: '/dashboard/players', label: 'Joueurs', icon: UserCog }
]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '240px', background: '#141414', borderRight: '1px solid #1E1E1E', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '18px', color: '#FFF', marginBottom: '32px', padding: '0 8px' }}>
          Yass Training <span style={{ color: '#C8A84B' }}>Admin</span>
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
      <main style={{ flex: 1, padding: '32px' }}>
        {children}
      </main>
    </div>
  )
}