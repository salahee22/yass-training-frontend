'use client'
import { useEffect, useState } from 'react'
import { User, ArrowLeft } from 'lucide-react'
import ChatWindow from '@/components/ChatWindow'

export default function PlayerMessagesPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeConv, setActiveConv] = useState(null)
  const currentUserId = getCurrentUserId()

  useEffect(() => { fetchConversations() }, [])

  async function fetchConversations() {
    setLoading(true)
    try {
      const token = localStorage.getItem('player_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      const convs = json.data || []
      setConversations(convs)
      if (convs.length > 0 && !activeConv) setActiveConv(convs[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '24px' }}>
        Messages
      </h1>

      <div className="msgLayout" style={{ background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', height: '60vh', display: 'flex' }}>
        <div className={`convList${activeConv ? ' mobile-hide' : ''}`} style={{ width: '260px', flexShrink: 0, borderRight: '1px solid #1E1E1E', overflowY: 'auto' }}>
          {loading ? (
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '16px' }}>Chargement...</p>
          ) : conversations.length === 0 ? (
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '16px' }}>Aucune conversation pour l'instant.</p>
          ) : (
            conversations.map(conv => {
              const other = conv.participants.find(p => p._id !== currentUserId)
              const isActive = activeConv?._id === conv._id
              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #1E1E1E', cursor: 'pointer', background: isActive ? '#1E1E1E' : 'transparent' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={14} color="#888" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF' }}>{other?.name || 'Coach'}</p>
                    {conv.unread_count > 0 && (
                      <span style={{ background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, borderRadius: '10px', padding: '1px 6px' }}>
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className={`chatPane${!activeConv ? ' mobile-hide' : ''}`} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <button
            className="backBtn"
            onClick={() => setActiveConv(null)}
            style={{ display: 'none', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}
          >
            <ArrowLeft size={15} /> Conversations
          </button>

          {activeConv ? (
            <ChatWindow conversation={activeConv} currentUserId={currentUserId} tokenKey="player_token" onMessageSent={fetchConversations} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Ton coach n'a pas encore démarré de conversation.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .msgLayout {
            height: 75vh;
          }
          .convList {
            width: 100% !important;
            border-right: none !important;
          }
          .convList.mobile-hide,
          .chatPane.mobile-hide {
            display: none !important;
          }
          .backBtn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}

function getCurrentUserId() {
  if (typeof window === 'undefined') return null
  try {
    const token = localStorage.getItem('player_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || payload._id || payload.userId || null
  } catch {
    return null
  }
}