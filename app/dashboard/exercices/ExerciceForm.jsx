'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save } from 'lucide-react'

const THEMES = [
  "Passe", "Tir", "Dribble", "Conduite de balle", "Contrôle",
  "Jeu collectif", "Vitesse", "Endurance", "Coordination",
  "Prise de balle", "Plongeons", "Relance", "Placement", "Réflexes", "Sorties aériennes",
]
const AGES = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior']
const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé']
const TYPES = [{ value: 'field', label: 'Joueur' }, { value: 'goalkeeper', label: 'Gardien' }]

const inputStyle = { width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px', marginTop: '16px' }
const sectionTitle = { fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFF', marginTop: '32px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #1E1E1E' }
const btnAdd = { display: 'flex', alignItems: 'center', gap: '6px', background: '#1E1E1E', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginTop: '10px' }
const btnRemove = { background: 'rgba(229,57,53,0.1)', color: '#E53935', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', flexShrink: 0 }
const blockBox = { background: '#181818', border: '1px solid #262626', borderRadius: '8px', padding: '16px', marginBottom: '12px' }

export default function ExerciceForm({ initialData, exerciceId }) {
  const router = useRouter()
  const isEdit = !!exerciceId
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(initialData || {
    name: '', description: '', objective: '', material: '',
    theme: THEMES[0], age: AGES[0], level: 'Débutant', type: 'field', duration: '15 min',
    image: '', images: [], video: '',
    detail_image: '',
    sections: [],
    planImages: [],
    organisation: { title: 'Organisation', items: [''] },
    consignes: { title: 'Consignes', items: [''] },
    roles: { title: 'Rôle des entraîneurs', items: [''] },
    categories: [],
    subThemes: [],
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
    const copy = [...form.images]; copy[i] = value; update('images', copy)
  }
  const removeImage = (i) => update('images', form.images.filter((_, idx) => idx !== i))

  // --- Sections ---
  const addSection = () => update('sections', [...form.sections, { title: '', paragraphs: [''] }])
  const removeSection = (i) => update('sections', form.sections.filter((_, idx) => idx !== i))
  const updateSectionTitle = (i, value) => {
    const copy = [...form.sections]; copy[i] = { ...copy[i], title: value }; update('sections', copy)
  }
  const addSectionParagraph = (si) => {
    const copy = [...form.sections]; copy[si].paragraphs = [...copy[si].paragraphs, '']; update('sections', copy)
  }
  const updateSectionParagraph = (si, pi, value) => {
    const copy = [...form.sections]; copy[si].paragraphs[pi] = value; update('sections', copy)
  }
  const removeSectionParagraph = (si, pi) => {
    const copy = [...form.sections]; copy[si].paragraphs = copy[si].paragraphs.filter((_, idx) => idx !== pi); update('sections', copy)
  }

  // --- Plan images ---
  const addPlanImage = () => update('planImages', [...form.planImages, { id: '', caption: '', img: '' }])
  const updatePlanImage = (i, field, value) => {
    const copy = [...form.planImages]; copy[i] = { ...copy[i], [field]: value }; update('planImages', copy)
  }
  const removePlanImage = (i) => update('planImages', form.planImages.filter((_, idx) => idx !== i))

  // --- Text sections génériques (organisation, consignes, roles) ---
  const addTextItem = (key) => updateNested(`${key}.items`, [...form[key].items, ''])
  const updateTextItem = (key, i, value) => {
    const copy = [...form[key].items]; copy[i] = value; updateNested(`${key}.items`, copy)
  }
  const removeTextItem = (key, i) => updateNested(`${key}.items`, form[key].items.filter((_, idx) => idx !== i))

  // --- Categories / subThemes (simple tags) ---
  const addTag = (key) => update(key, [...form[key], ''])
  const updateTag = (key, i, value) => {
    const copy = [...form[key]]; copy[i] = value; update(key, copy)
  }
  const removeTag = (key, i) => update(key, form[key].filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/exercices/${exerciceId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/exercices`
      const method = isEdit ? 'PUT' : 'POST'

      const payload = {
        ...form,
        images: (form.images || []).filter(i => i.trim()),
        organisation: { ...form.organisation, items: form.organisation.items.filter(i => i.trim()) },
        consignes: { ...form.consignes, items: form.consignes.items.filter(i => i.trim()) },
        roles: { ...form.roles, items: form.roles.items.filter(i => i.trim()) },
        categories: form.categories.filter(c => c.trim()),
        subThemes: form.subThemes.filter(s => s.trim()),
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

      router.push('/dashboard/exercices')
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
      {error && (
        <p style={{ background: 'rgba(229,57,53,0.15)', color: '#E53935', fontSize: '13px', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      )}

      {/* INFOS DE BASE */}
      <p style={sectionTitle}>Informations générales</p>

      <label style={labelStyle}>Nom</label>
      <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} required />

      <label style={labelStyle}>Description</label>
      <textarea style={{ ...inputStyle, minHeight: '70px' }} value={form.description} onChange={e => update('description', e.target.value)} required />

      <label style={labelStyle}>Objectif</label>
      <input style={inputStyle} value={form.objective} onChange={e => update('objective', e.target.value)} required />

      <label style={labelStyle}>Matériel</label>
      <input style={inputStyle} value={form.material || ''} onChange={e => update('material', e.target.value)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Thème</label>
          <select style={inputStyle} value={form.theme} onChange={e => update('theme', e.target.value)}>
            {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Âge</label>
          <select style={inputStyle} value={form.age} onChange={e => update('age', e.target.value)}>
            {AGES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Niveau</label>
          <select style={inputStyle} value={form.level} onChange={e => update('level', e.target.value)}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select style={inputStyle} value={form.type} onChange={e => update('type', e.target.value)}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Durée</label>
          <input style={inputStyle} value={form.duration} onChange={e => update('duration', e.target.value)} />
        </div>
      </div>

      <label style={labelStyle}>Image principale (URL)</label>
      <input style={inputStyle} value={form.image} onChange={e => update('image', e.target.value)} />

      <label style={labelStyle}>Image détaillée (page exercice, URL)</label>
      <input style={inputStyle} value={form.detail_image || ''} onChange={e => update('detail_image', e.target.value)} />

      {/* GALERIE */}
      <p style={sectionTitle}>Galerie photos</p>
      {(form.images || []).map((img, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={inputStyle} placeholder="URL de l'image" value={img} onChange={e => updateImage(i, e.target.value)} />
          <button type="button" onClick={() => removeImage(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addImage} style={btnAdd}><Plus size={13} /> Ajouter une image</button>

      {/* SECTIONS (description détaillée) */}
      <p style={sectionTitle}>Sections descriptives</p>
      {form.sections.map((sec, si) => (
        <div key={si} style={blockBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C8A84B' }}>Section {si + 1}</span>
            <button type="button" onClick={() => removeSection(si)} style={btnRemove}><Trash2 size={14} /></button>
          </div>
          <input style={inputStyle} placeholder="Titre de la section" value={sec.title} onChange={e => updateSectionTitle(si, e.target.value)} />

          <label style={{ ...labelStyle, marginTop: '12px' }}>Paragraphes</label>
          {sec.paragraphs.map((p, pi) => (
            <div key={pi} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <textarea style={{ ...inputStyle, minHeight: '50px' }} value={p} onChange={e => updateSectionParagraph(si, pi, e.target.value)} />
              <button type="button" onClick={() => removeSectionParagraph(si, pi)} style={btnRemove}><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addSectionParagraph(si)} style={btnAdd}><Plus size={13} /> Paragraphe</button>
        </div>
      ))}
      <button type="button" onClick={addSection} style={btnAdd}><Plus size={13} /> Ajouter une section</button>

      {/* PLAN IMAGES */}
      <p style={sectionTitle}>Images du plan de séance</p>
      {form.planImages.map((pi, i) => (
        <div key={i} style={blockBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C8A84B' }}>Image {i + 1}</span>
            <button type="button" onClick={() => removePlanImage(i)} style={btnRemove}><Trash2 size={14} /></button>
          </div>
          <input style={inputStyle} placeholder="Repère (ex: 1/4)" value={pi.id} onChange={e => updatePlanImage(i, 'id', e.target.value)} />
          <input style={{ ...inputStyle, marginTop: '8px' }} placeholder="URL de l'image" value={pi.img} onChange={e => updatePlanImage(i, 'img', e.target.value)} />
          <textarea style={{ ...inputStyle, minHeight: '50px', marginTop: '8px' }} placeholder="Légende" value={pi.caption} onChange={e => updatePlanImage(i, 'caption', e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={addPlanImage} style={btnAdd}><Plus size={13} /> Ajouter une image de plan</button>

      {/* ORGANISATION / CONSIGNES / ROLES */}
      {['organisation', 'consignes', 'roles'].map(key => (
        <div key={key}>
          <p style={sectionTitle}>{form[key].title || key}</p>
          <input style={inputStyle} placeholder="Titre de la section" value={form[key].title} onChange={e => updateNested(`${key}.title`, e.target.value)} />
          <label style={labelStyle}>Points</label>
          {form[key].items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <textarea style={{ ...inputStyle, minHeight: '50px' }} value={item} onChange={e => updateTextItem(key, i, e.target.value)} />
              <button type="button" onClick={() => removeTextItem(key, i)} style={btnRemove}><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addTextItem(key)} style={btnAdd}><Plus size={13} /> Ajouter un point</button>
        </div>
      ))}

      {/* CATEGORIES & SUBTHEMES */}
      <p style={sectionTitle}>Catégories</p>
      {form.categories.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={inputStyle} placeholder="ex: U13" value={c} onChange={e => updateTag('categories', i, e.target.value)} />
          <button type="button" onClick={() => removeTag('categories', i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={() => addTag('categories')} style={btnAdd}><Plus size={13} /> Ajouter une catégorie</button>

      <p style={sectionTitle}>Sous-thèmes</p>
      {form.subThemes.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={inputStyle} placeholder="ex: jeu collectif" value={s} onChange={e => updateTag('subThemes', i, e.target.value)} />
          <button type="button" onClick={() => removeTag('subThemes', i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={() => addTag('subThemes')} style={btnAdd}><Plus size={13} /> Ajouter un sous-thème</button>

      {/* SUBMIT */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #1E1E1E' }}>
        <button
          type="submit"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C8A84B', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          <Save size={15} /> {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer l\'exercice'}
        </button>
      </div>
    </form>  
  )
}