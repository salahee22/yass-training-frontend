'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Dumbbell, ArrowRight } from 'lucide-react'

export default function DashboardHome() {
  const [counts, setCounts] = useState({ articles: 0, exercices: 0 })

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [articlesRes, exercicesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices`),
        ])
        const articlesJson = await articlesRes.json()
        const exercicesJson = await exercicesRes.json()
        setCounts({
          articles: articlesJson.pagination?.total ?? articlesJson.data?.length ?? 0,
          exercices: exercicesJson.pagination?.total ?? exercicesJson.data?.length ?? 0,
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchCounts()
  }, [])

  const cards = [
    { label: 'Articles', count: counts.articles, href: '/dashboard/articles', icon: FileText },
    { label: 'Exercices', count: counts.exercices, href: '/dashboard/exercices', icon: Dumbbell },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Vue d'ensemble
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {cards.map(card => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '24px', transition: 'border-color 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C8A84B'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1E1E1E'}
              >
                <Icon size={20} color="#C8A84B" style={{ marginBottom: '16px' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>{card.count}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>{card.label}</span>
                  <ArrowRight size={14} color="#666" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}