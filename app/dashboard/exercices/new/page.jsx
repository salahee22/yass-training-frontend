'use client'
import ExerciceForm from '../ExerciceForm'

export default function NewExercicePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Nouvel exercice
      </h1>
      <ExerciceForm />
    </div>
  )
}