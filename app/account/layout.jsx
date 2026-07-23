'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Dumbbell, TrendingUp, Settings, LogOut } from 'lucide-react'
import { RiWhatsappLine } from 'react-icons/ri'

export default function AccountLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

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
    { href: '/account/settings', label: 'Paramètres', icon: Settings },
  ]

  const canContactWhatsApp = subscription && subscription.plan_name !== 'basic'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', background: '#0A0A0A' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '32px' }}>

        <aside style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>{user?.name}</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>{user?.email}</p>
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

        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>

      {canContactWhatsApp && (
        <a
          href="https://wa.me/213561419431"
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
    </div>
  )
}