'use client'
import { useEffect, useState, useRef } from 'react'
import { Send } from 'lucide-react'

const inputStyle = { background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none', width: '100%' }
const btnGold = { background: '#C8A84B', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer' }

export default function ChatWindow({ conversation, currentUserId, tokenKey, onMessageSent }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { fetchMessages() }, [conversation._id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function fetchMessages() {
    setLoading(true)
    try {
      const token = localStorage.getItem(tokenKey)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversation._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setMessages(json.data || [])
      onMessageSent?.()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    try {
      const token = localStorage.getItem(tokenKey)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversation._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: text.trim() }),
      })
      const json = await res.json()
      if (res.ok) {
        setMessages(prev => [...prev, json.data])
        setText('')
        onMessageSent?.()
      } else {
        alert(json.message || 'Erreur')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setSending(false)
    }
  }

  const other = conversation.participants.find(p => p._id !== currentUserId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E1E1E' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFF' }}>{other?.name || 'Utilisateur'}</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888' }}>{other?.email}</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>Chargement...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: '#666', fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>Aucun message. Écris le premier !</p>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === currentUserId
            return (
              <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '65%', background: isMine ? '#C8A84B' : '#1E1E1E', color: isMine ? '#000' : '#FFF',
                  fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '9px 13px', borderRadius: '10px',
                }}>
                  {msg.content}
                  <p style={{ fontSize: '10px', color: isMine ? 'rgba(0,0,0,0.5)' : '#666', marginTop: '4px' }}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: '14px 20px', borderTop: '1px solid #1E1E1E' }}>
        <input
          style={inputStyle}
          placeholder="Écris un message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" disabled={sending} style={{ ...btnGold, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}