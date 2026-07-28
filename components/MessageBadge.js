'use client'
import { useEffect, useState } from 'react'

export default function MessageBadge({ tokenKey }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      try {
        const token = localStorage.getItem(tokenKey)
        if (!token) return
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        setCount(json.data?.count || 0)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCount()
  }, [tokenKey])

  if (count === 0) return null

  return (
    <span style={{ background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, borderRadius: '10px', padding: '1px 6px', marginLeft: '6px' }}>
      {count}
    </span>
  )
}