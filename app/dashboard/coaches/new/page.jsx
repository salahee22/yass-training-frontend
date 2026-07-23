'use client'
import CoachForm from '../CoachForm'

export default function NewCoachPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Nouveau coach
      </h1>
      <CoachForm />
    </div>
  )
}