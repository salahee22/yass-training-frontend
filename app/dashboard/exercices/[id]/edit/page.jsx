'use client'
import { useEffect, useState, use } from 'react'
import ExerciceForm from '../../ExerciceForm'

export default function EditExercicePage({ params }) {
  const { id } = use(params)
  const [exercice, setExercice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExercice() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercices/${id}`)
        const json = await res.json()
        const data = json.data

        setExercice({
          name: data.name || '',
          description: data.description || '',
          objective: data.objective || '',
          material: data.material || '',
          theme: data.theme || 'Passe',
          age: data.age || 'U7',
          level: data.level || 'Débutant',
          type: data.type || 'field',
          duration: data.duration || '15 min',
          image: data.image || '',
          images: data.images || [],
          video: data.video || '',
          detail_image: data.detail_image || '',
          sections: data.sections || [],
          planImages: data.planImages || [],
          organisation: { title: data.organisation?.title || 'Organisation', items: data.organisation?.items?.length ? data.organisation.items : [''] },
          consignes: { title: data.consignes?.title || 'Consignes', items: data.consignes?.items?.length ? data.consignes.items : [''] },
          roles: { title: data.roles?.title || 'Rôle des entraîneurs', items: data.roles?.items?.length ? data.roles.items : [''] },
          categories: data.categories || [],
          subThemes: data.subThemes || [],
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchExercice()
  }, [id])

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
  if (!exercice) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Exercice introuvable.</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Éditer l'exercice
      </h1>
      <ExerciceForm initialData={exercice} exerciceId={id} />
    </div>
  )
}