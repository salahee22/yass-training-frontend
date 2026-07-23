'use client'
import { useEffect, useState, use } from 'react'
import ArticleForm from '../../ArticleForm'

export default function EditArticlePage({ params }) {
  const { id } = use(params)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`)
        const json = await res.json()
        const data = json.data

        // Complète les champs manquants pour que le formulaire ne casse pas
        setArticle({
          title: data.title || '',
          summary: data.summary || '',
          content: data.content || '',
          category: data.category || 'Technique',
          age: data.age || '',
          image: data.image || '',
          images: data.images || [],
          video: data.video || '',
          read_time: data.read_time || '5 min',
          tag: data.tag || '',
          intro: {
            label: data.intro?.label || 'INTRODUCTION',
            subtitle: data.intro?.subtitle || '',
            paragraphs: data.intro?.paragraphs?.length ? data.intro.paragraphs : [''],
          },
          chapters: data.chapters || [],
          conclusion: {
            label: data.conclusion?.label || 'CONCLUSION',
            theme: data.conclusion?.theme || '',
            title: data.conclusion?.title || '',
            paragraph: data.conclusion?.paragraph?.length ? data.conclusion.paragraph : [''],
          },
          sidebar: {
            expert: {
              name: data.sidebar?.expert?.name || '',
              role: data.sidebar?.expert?.role || '',
              description: data.sidebar?.expert?.description || '',
              keyFigures: data.sidebar?.expert?.keyFigures || [],
            },
            parcours: {
              title: data.sidebar?.parcours?.title || '',
              items: data.sidebar?.parcours?.items || [],
            },
          },
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Chargement...</p>
  if (!article) return <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>Article introuvable.</p>

  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Éditer l'article
      </h1>
      <ArticleForm initialData={article} articleId={id} />
    </div>
  )
}