'use client'
import { useEffect, useState } from 'react'
import { User, X, Plus, ArrowLeft } from 'lucide-react'
import ChatWindow from '@/components/ChatWindow'

const inputStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', width: '100%' }
const btnGold = { background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeConv, setActiveConv] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)

  const currentUserId = getCurrentUserId()

  useEffect(() => { fetchConversations() }, [])

  async function fetchConversations() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setConversations(json.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function openConversation(conv) {
    setActiveConv(conv)
  }

  async function handleStartConversation(playerId) {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ participant_id: playerId }),
      })
      const json = await res.json()
      if (res.ok) {
        setShowNewModal(false)
        await fetchConversations()
        setActiveConv(json.data)
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    }
  }

  return (
    <div className="adminMsgLayout" style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
      <div className={`convListAdmin${activeConv ? ' mobile-hide' : ''}`} style={{ width: '320px', flexShrink: 0, background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #1E1E1E' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '18px', color: '#FFF' }}>Messages</p>
          <button onClick={() => setShowNewModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', ...btnGold, padding: '6px 10px' }}>
            <Plus size={13} /> Nouveau
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '16px' }}>Chargement...</p>
          ) : conversations.length === 0 ? (
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px', padding: '16px' }}>Aucune conversation.</p>
          ) : (
            conversations.map(conv => {
              const other = conv.participants.find(p => p._id !== currentUserId)
              const isActive = activeConv?._id === conv._id
              return (
                <div
                  key={conv._id}
                  onClick={() => openConversation(conv)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                    borderBottom: '1px solid #1E1E1E', cursor: 'pointer',
                    background: isActive ? '#1E1E1E' : 'transparent',
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="#888" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {other?.name || 'Utilisateur'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span style={{ background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, borderRadius: '10px', padding: '2px 7px', flexShrink: 0 }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.last_message || 'Aucun message'}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className={`chatPaneAdmin${!activeConv ? ' mobile-hide' : ''}`} style={{ flex: 1, minWidth: 0, background: '#141414', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <button
          className="backBtnAdmin"
          onClick={() => setActiveConv(null)}
          style={{ display: 'none', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}
        >
          <ArrowLeft size={15} /> Conversations
        </button>

        {activeConv ? (
          <ChatWindow
            conversation={activeConv}
            currentUserId={currentUserId}
            tokenKey="admin_token"
            onMessageSent={fetchConversations}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>Sélectionne une conversation.</p>
          </div>
        )}
      </div>

      {showNewModal && (
        <NewConversationModal onClose={() => setShowNewModal(false)} onSelect={handleStartConversation} />
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .adminMsgLayout {
            height: calc(100vh - 90px);
          }
          .convListAdmin {
            width: 100% !important;
          }
          .convListAdmin.mobile-hide,
          .chatPaneAdmin.mobile-hide {
            display: none !important;
          }
          .backBtnAdmin {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}

function NewConversationModal({ onClose, onSelect }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const token = localStorage.getItem('admin_token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=player`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        setPlayers(json.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [])

  const filtered = players.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: '#141414', border: '1px solid #262626', borderRadius: '12px', padding: '20px', maxWidth: '380px', width: '100%', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFF' }}>Nouveau message</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <input
          style={{ ...inputStyle, marginBottom: '12px' }}
          placeholder="Rechercher un joueur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>Chargement...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>Aucun joueur trouvé.</p>
          ) : (
            filtered.map(p => (
              <div
                key={p._id}
                onClick={() => onSelect(p._id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 8px', borderRadius: '6px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1E1E1E'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#888" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FFF', fontWeight: 600 }}>{p.name}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>{p.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function getCurrentUserId() {
  if (typeof window === 'undefined') return null
  try {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('player_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || payload._id || payload.userId || null
  } catch {
    return null
  }
}