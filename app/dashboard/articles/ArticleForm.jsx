'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save } from 'lucide-react'

const CATEGORIES = ['Technique', 'Tactique', 'Physique', 'Mental', 'Nutrition']
const AGES = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior']

const inputStyle = { width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px', marginTop: '16px' }
const sectionTitle = { fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFF', marginTop: '32px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #1E1E1E' }

export default function ArticleForm({ initialData, articleId }) {
  const router = useRouter()
  const isEdit = !!articleId
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(initialData || {
    title: '', summary: '', content: '', category: 'Technique', age: '',
    image: '', images: [], video: '', read_time: '5 min', tag: '',
    intro: { label: 'INTRODUCTION', subtitle: '', paragraphs: [''] },
    chapters: [],
    conclusion: { label: 'CONCLUSION', theme: '', title: '', paragraph: [''] },
    sidebar: {
      expert: { name: '', role: '', description: '', keyFigures: [] },
      parcours: { title: '', items: [] },
    },
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const updateNested = (path, value) => {
    setForm(prev => {
      const copy = structuredClone(prev)
      const keys = path.split('.')
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return copy
    })
  }

  // --- Images galerie ---
  const addImage = () => update('images', [...(form.images || []), ''])
  const updateImage = (i, value) => {
    const copy = [...form.images]
    copy[i] = value
    update('images', copy)
  }
  const removeImage = (i) => update('images', form.images.filter((_, idx) => idx !== i))

  // --- Intro paragraphs ---
  const addIntroParagraph = () => updateNested('intro.paragraphs', [...form.intro.paragraphs, ''])
  const updateIntroParagraph = (i, value) => {
    const copy = [...form.intro.paragraphs]
    copy[i] = value
    updateNested('intro.paragraphs', copy)
  }
  const removeIntroParagraph = (i) => updateNested('intro.paragraphs', form.intro.paragraphs.filter((_, idx) => idx !== i))

  // --- Chapters ---
  const addChapter = () => update('chapters', [...form.chapters, { label: '', theme: '', title: '', image: '', paragraphs: [''], quote: '' }])
  const removeChapter = (i) => update('chapters', form.chapters.filter((_, idx) => idx !== i))
  const updateChapter = (i, field, value) => {
    const copy = [...form.chapters]
    copy[i] = { ...copy[i], [field]: value }
    update('chapters', copy)
  }
  const addChapterParagraph = (ci) => {
    const copy = [...form.chapters]
    copy[ci].paragraphs = [...copy[ci].paragraphs, '']
    update('chapters', copy)
  }
  const updateChapterParagraph = (ci, pi, value) => {
    const copy = [...form.chapters]
    copy[ci].paragraphs[pi] = value
    update('chapters', copy)
  }
  const removeChapterParagraph = (ci, pi) => {
    const copy = [...form.chapters]
    copy[ci].paragraphs = copy[ci].paragraphs.filter((_, idx) => idx !== pi)
    update('chapters', copy)
  }

  // --- Conclusion paragraphs ---
  const addConclusionParagraph = () => updateNested('conclusion.paragraph', [...form.conclusion.paragraph, ''])
  const updateConclusionParagraph = (i, value) => {
    const copy = [...form.conclusion.paragraph]
    copy[i] = value
    updateNested('conclusion.paragraph', copy)
  }
  const removeConclusionParagraph = (i) => updateNested('conclusion.paragraph', form.conclusion.paragraph.filter((_, idx) => idx !== i))

  // --- Sidebar expert keyFigures ---
  const addKeyFigure = () => updateNested('sidebar.expert.keyFigures', [...form.sidebar.expert.keyFigures, { value: '', label: '' }])
  const updateKeyFigure = (i, field, value) => {
    const copy = [...form.sidebar.expert.keyFigures]
    copy[i] = { ...copy[i], [field]: value }
    updateNested('sidebar.expert.keyFigures', copy)
  }
  const removeKeyFigure = (i) => updateNested('sidebar.expert.keyFigures', form.sidebar.expert.keyFigures.filter((_, idx) => idx !== i))

  // --- Sidebar parcours items ---
  const addParcoursItem = () => updateNested('sidebar.parcours.items', [...form.sidebar.parcours.items, { year: '', text: '' }])
  const updateParcoursItem = (i, field, value) => {
    const copy = [...form.sidebar.parcours.items]
    copy[i] = { ...copy[i], [field]: value }
    updateNested('sidebar.parcours.items', copy)
  }
  const removeParcoursItem = (i) => updateNested('sidebar.parcours.items', form.sidebar.parcours.items.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/articles`
      const method = isEdit ? 'PUT' : 'POST'

      // Nettoyage : enlève les paragraphes/chapitres vides pour ne pas polluer
      const payload = {
        ...form,
        intro: { ...form.intro, paragraphs: form.intro.paragraphs.filter(p => p.trim()) },
        conclusion: { ...form.conclusion, paragraph: form.conclusion.paragraph.filter(p => p.trim()) },
        images: (form.images || []).filter(i => i.trim()),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.errors?.map(e => e.message).join(', ') || json.message || 'Erreur')
        return
      }

      router.push('/dashboard/articles')
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const btnAdd = { display: 'flex', alignItems: 'center', gap: '6px', background: '#1E1E1E', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginTop: '10px' }
  const btnRemove = { background: 'rgba(229,57,53,0.1)', color: '#E53935', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', flexShrink: 0 }
  const blockBox = { background: '#181818', border: '1px solid #262626', borderRadius: '8px', padding: '16px', marginBottom: '12px' }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
      {error && (
        <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}

      {/* INFOS DE BASE */}
      <p style={sectionTitle}>Informations générales</p>

      <label style={labelStyle}>Titre</label>
      <input style={inputStyle} value={form.title} onChange={e => update('title', e.target.value)} required />

      <label style={labelStyle}>Résumé (300 caractères max)</label>
      <textarea style={{ ...inputStyle, minHeight: '70px' }} value={form.summary} onChange={e => update('summary', e.target.value)} required />

      <label style={labelStyle}>Contenu (texte brut de base)</label>
      <textarea style={{ ...inputStyle, minHeight: '100px' }} value={form.content} onChange={e => update('content', e.target.value)} required />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Catégorie</label>
          <select style={inputStyle} value={form.category} onChange={e => update('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Âge</label>
          <select style={inputStyle} value={form.age || ''} onChange={e => update('age', e.target.value)}>
            <option value="">—</option>
            {AGES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <label style={labelStyle}>Image principale (URL)</label>
      <input style={inputStyle} value={form.image} onChange={e => update('image', e.target.value)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Temps de lecture</label>
          <input style={inputStyle} value={form.read_time} onChange={e => update('read_time', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Tag</label>
          <input style={inputStyle} value={form.tag || ''} onChange={e => update('tag', e.target.value)} />
        </div>
      </div>

      {/* GALERIE */}
      <p style={sectionTitle}>Galerie photos</p>
      {(form.images || []).map((img, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={inputStyle} placeholder="URL de l'image" value={img} onChange={e => updateImage(i, e.target.value)} />
          <button type="button" onClick={() => removeImage(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addImage} style={btnAdd}><Plus size={13} /> Ajouter une image</button>

      {/* INTRO */}
      <p style={sectionTitle}>Introduction</p>
      <label style={labelStyle}>Sous-titre</label>
      <input style={inputStyle} value={form.intro.subtitle} onChange={e => updateNested('intro.subtitle', e.target.value)} />

      <label style={labelStyle}>Paragraphes</label>
      {form.intro.paragraphs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={p} onChange={e => updateIntroParagraph(i, e.target.value)} />
          <button type="button" onClick={() => removeIntroParagraph(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addIntroParagraph} style={btnAdd}><Plus size={13} /> Ajouter un paragraphe</button>

      {/* CHAPITRES */}
      <p style={sectionTitle}>Chapitres</p>
      {form.chapters.map((ch, ci) => (
        <div key={ci} style={blockBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C8A84B' }}>Chapitre {ci + 1}</span>
            <button type="button" onClick={() => removeChapter(ci)} style={btnRemove}><Trash2 size={14} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input style={inputStyle} placeholder="Label (ex: CHAPITRE I)" value={ch.label} onChange={e => updateChapter(ci, 'label', e.target.value)} />
            <input style={inputStyle} placeholder="Thème (ex: TACTIQUE)" value={ch.theme} onChange={e => updateChapter(ci, 'theme', e.target.value)} />
          </div>
          <input style={{ ...inputStyle, marginTop: '8px' }} placeholder="Titre du chapitre" value={ch.title} onChange={e => updateChapter(ci, 'title', e.target.value)} />
          <input style={{ ...inputStyle, marginTop: '8px' }} placeholder="Image (URL)" value={ch.image} onChange={e => updateChapter(ci, 'image', e.target.value)} />

          <label style={{ ...labelStyle, marginTop: '12px' }}>Paragraphes</label>
          {ch.paragraphs.map((p, pi) => (
            <div key={pi} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <textarea style={{ ...inputStyle, minHeight: '50px' }} value={p} onChange={e => updateChapterParagraph(ci, pi, e.target.value)} />
              <button type="button" onClick={() => removeChapterParagraph(ci, pi)} style={btnRemove}><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addChapterParagraph(ci)} style={btnAdd}><Plus size={13} /> Paragraphe</button>

          <label style={labelStyle}>Citation (optionnel)</label>
          <textarea style={{ ...inputStyle, minHeight: '50px' }} value={ch.quote} onChange={e => updateChapter(ci, 'quote', e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={addChapter} style={btnAdd}><Plus size={13} /> Ajouter un chapitre</button>

      {/* CONCLUSION */}
      <p style={sectionTitle}>Conclusion</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <input style={inputStyle} placeholder="Thème" value={form.conclusion.theme} onChange={e => updateNested('conclusion.theme', e.target.value)} />
        <input style={inputStyle} placeholder="Titre" value={form.conclusion.title} onChange={e => updateNested('conclusion.title', e.target.value)} />
      </div>
      <label style={labelStyle}>Paragraphes</label>
      {form.conclusion.paragraph.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={p} onChange={e => updateConclusionParagraph(i, e.target.value)} />
          <button type="button" onClick={() => removeConclusionParagraph(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addConclusionParagraph} style={btnAdd}><Plus size={13} /> Ajouter un paragraphe</button>

      {/* SIDEBAR — EXPERT */}
      <p style={sectionTitle}>Sidebar — Expert</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <input style={inputStyle} placeholder="Nom" value={form.sidebar.expert.name} onChange={e => updateNested('sidebar.expert.name', e.target.value)} />
        <input style={inputStyle} placeholder="Rôle" value={form.sidebar.expert.role} onChange={e => updateNested('sidebar.expert.role', e.target.value)} />
      </div>
      <textarea style={{ ...inputStyle, minHeight: '70px', marginTop: '8px' }} placeholder="Description" value={form.sidebar.expert.description} onChange={e => updateNested('sidebar.expert.description', e.target.value)} />

      <label style={labelStyle}>Chiffres clés</label>
      {form.sidebar.expert.keyFigures.map((kf, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={{ ...inputStyle, width: '100px' }} placeholder="Valeur (ex: 67%)" value={kf.value} onChange={e => updateKeyFigure(i, 'value', e.target.value)} />
          <input style={inputStyle} placeholder="Label" value={kf.label} onChange={e => updateKeyFigure(i, 'label', e.target.value)} />
          <button type="button" onClick={() => removeKeyFigure(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addKeyFigure} style={btnAdd}><Plus size={13} /> Ajouter un chiffre clé</button>

      {/* SIDEBAR — PARCOURS */}
      <p style={sectionTitle}>Sidebar — Parcours</p>
      <input style={inputStyle} placeholder="Titre du parcours" value={form.sidebar.parcours.title} onChange={e => updateNested('sidebar.parcours.title', e.target.value)} />

      <label style={labelStyle}>Étapes</label>
      {form.sidebar.parcours.items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={{ ...inputStyle, width: '90px' }} placeholder="Année" value={item.year} onChange={e => updateParcoursItem(i, 'year', e.target.value)} />
          <textarea style={{ ...inputStyle, minHeight: '50px' }} placeholder="Texte" value={item.text} onChange={e => updateParcoursItem(i, 'text', e.target.value)} />
          <button type="button" onClick={() => removeParcoursItem(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addParcoursItem} style={btnAdd}><Plus size={13} /> Ajouter une étape</button>

      {/* SUBMIT */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #1E1E1E' }}>
        <button
          type="submit"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C8A84B', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          <Save size={15} /> {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer l\'article'}
        </button>
      </div>
    </form>
  )
}