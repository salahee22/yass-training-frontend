'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const hideNavbar =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname === '/login'

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      {!hideNavbar && <Footer />}
    </>
  )
}