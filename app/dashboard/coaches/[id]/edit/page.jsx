'use client'
import { useEffect, useState, use } from 'react'
import CoachForm from '../../CoachForm'

export default function EditCoachPage({ params }) {
  const { id } = use(params)
  const [coach, setCoach] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCoach() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coaches/${id}`)
        const json = await res.json()
        const data = json.data
        setCoach({
          name: data.name || '',
          role: data.role || '',
          experience: data.experience || '',
          diplomes: data.diplomes || '',
          specialite: data.specialite || '',
          image: data.image || '',
          color: data.color || '#C8A84B',
          order: data.order || 0,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCoach()
  }, [id])

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
  if (!coach) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Coach introuvable.</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Éditer le coach
      </h1>
      <CoachForm initialData={coach} coachId={id} />
    </div>
  )
}