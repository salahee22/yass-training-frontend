'use client'
import ArticleForm from '../ArticleForm'

export default function NewArticlePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#FFF', marginBottom: '32px' }}>
        Nouvel article
      </h1>
      <ArticleForm />
    </div>
  )
}