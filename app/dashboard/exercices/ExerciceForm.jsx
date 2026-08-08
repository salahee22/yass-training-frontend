'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react'
 
const THEMES = [
  "Passe", "Tir", "Dribble", "Conduite de balle", "Contrôle",
  "Jeu collectif", "Vitesse", "Endurance", "Coordination",
  "Prise de balle", "Plongeons", "Relance", "Placement", "Réflexes", "Sorties aériennes",
]
const AGES = ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'Senior']
const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé']
const TYPES = [{ value: 'field', label: 'Joueur' }, { value: 'goalkeeper', label: 'Gardien' }]
 
const emptyBloc = () => ({
  title: '',
  image: '',
  video: '',
  planImages: [],
  organisation: { title: 'Organisation', items: [''] },
  consignes: { title: 'Consignes', items: [''] },
  roles: { title: 'Rôle des entraîneurs', items: [''] },
})
 
const FIELD_LABELS = {
  name: 'Nom',
  description: 'Description',
  objective: 'Objectif',
  material: 'Matériel',
  theme: 'Thème',
  age: 'Âge',
  level: 'Niveau',
  type: 'Type',
  duration: 'Durée',
  image: 'Image principale',
  detail_image: 'Image détaillée',
  images: 'Galerie photos',
  video: 'Vidéo',
  sections: 'Sections descriptives',
  blocs: 'Bloc',
  categories: 'Catégories',
  subThemes: 'Sous-thèmes',
}
 
function humanizeField(fieldPath) {
  if (!fieldPath) return null
  if (FIELD_LABELS[fieldPath]) return FIELD_LABELS[fieldPath]
 
  const parts = fieldPath.split('.')
  const root = parts[0]
  const rootLabel = FIELD_LABELS[root] || root
 
  const looksLikeUrlField = /image|img|video|url|lien/i.test(fieldPath)
  const indices = parts.filter(p => /^\d+$/.test(p))
  const blocIndex = root === 'blocs' && indices.length > 0 ? Number(indices[0]) + 1 : null
 
  const prefix = blocIndex != null ? `${rootLabel} ${blocIndex}` : rootLabel
  const lastIndex = indices.length ? Number(indices[indices.length - 1]) + 1 : null
 
  if (looksLikeUrlField) {
    return blocIndex != null && indices.length > 1
      ? `${prefix} : lien invalide (élément ${lastIndex})`
      : `${prefix} : lien invalide`
  }
 
  return blocIndex != null ? prefix : (lastIndex != null ? `${rootLabel} (élément ${lastIndex})` : rootLabel)
}
 
function parseServerErrors(json) {
  const rawErrors = json?.errors
  if (!Array.isArray(rawErrors) || rawErrors.length === 0) {
    return json?.message ? [json.message] : []
  }
 
  return rawErrors.map(err => {
    const fieldPath = err.path || err.param || err.field || null
    const rawMsg = err.msg || err.message || 'Champ invalide'
    const label = humanizeField(fieldPath)
    return label ? `${label} — ${rawMsg}` : rawMsg
  })
}
 
const inputStyle = { width: '100%', background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '10px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none' }
const labelStyle = { display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#AAA', marginBottom: '6px', marginTop: '16px' }
const sectionTitle = { fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: '#FFF', marginTop: '32px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #1E1E1E' }
const btnAdd = { display: 'flex', alignItems: 'center', gap: '6px', background: '#1E1E1E', color: '#C8A84B', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginTop: '10px' }
const btnRemove = { background: 'rgba(229,57,53,0.1)', color: '#E53935', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', flexShrink: 0 }
const blockBox = { background: '#181818', border: '1px solid #262626', borderRadius: '8px', padding: '16px', marginBottom: '12px' }
const blocBox = { background: '#141414', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '20px', marginBottom: '20px' }
const nestedBox = { background: '#1B1B1B', border: '1px solid #262626', borderRadius: '8px', padding: '14px', marginTop: '14px' }
const helperText = { fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666', marginTop: '4px' }
 
export default function ExerciceForm({ initialData, exerciceId }) {
  const router = useRouter()
  const isEdit = !!exerciceId
  const [saving, setSaving] = useState(false)
  const [errorList, setErrorList] = useState([])
  const [globalError, setGlobalError] = useState('')
 
  const [form, setForm] = useState(initialData || {
    name: '', description: '', objective: '', material: '',
    theme: THEMES[0], age: AGES[0], level: 'Débutant', type: 'field', duration: '15 min',
    image: '', images: [], video: '',
    detail_image: '',
    sections: [],
    blocs: [],
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
 
  const addImage = () => update('images', [...(form.images || []), ''])
  const updateImage = (i, value) => {
    const copy = [...form.images]; copy[i] = value; update('images', copy)
  }
  const removeImage = (i) => update('images', form.images.filter((_, idx) => idx !== i))
 
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
 
  const addBloc = () => update('blocs', [...(form.blocs || []), emptyBloc()])
  const removeBloc = (bi) => update('blocs', form.blocs.filter((_, idx) => idx !== bi))
  const updateBlocField = (bi, field, value) => {
    const copy = [...form.blocs]; copy[bi] = { ...copy[bi], [field]: value }; update('blocs', copy)
  }
  const updateBlocNested = (bi, path, value) => {
    setForm(prev => {
      const copy = structuredClone(prev)
      const keys = path.split('.')
      let obj = copy.blocs[bi]
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return copy
    })
  }
  const addBlocPlanImage = (bi) => {
    const copy = [...form.blocs]
    copy[bi] = { ...copy[bi], planImages: [...copy[bi].planImages, { id: '', caption: '', img: '' }] }
    update('blocs', copy)
  }
  const updateBlocPlanImage = (bi, i, field, value) => {
    const copy = [...form.blocs]
    const planImages = [...copy[bi].planImages]
    planImages[i] = { ...planImages[i], [field]: value }
    copy[bi] = { ...copy[bi], planImages }
    update('blocs', copy)
  }
  const removeBlocPlanImage = (bi, i) => {
    const copy = [...form.blocs]
    copy[bi] = { ...copy[bi], planImages: copy[bi].planImages.filter((_, idx) => idx !== i) }
    update('blocs', copy)
  }
  const addBlocTextItem = (bi, key) => updateBlocNested(bi, `${key}.items`, [...form.blocs[bi][key].items, ''])
  const updateBlocTextItem = (bi, key, i, value) => {
    const copy = [...form.blocs[bi][key].items]; copy[i] = value; updateBlocNested(bi, `${key}.items`, copy)
  }
  const removeBlocTextItem = (bi, key, i) => updateBlocNested(bi, `${key}.items`, form.blocs[bi][key].items.filter((_, idx) => idx !== i))
 
  const addTag = (key) => update(key, [...form[key], ''])
  const updateTag = (key, i, value) => {
    const copy = [...form[key]]; copy[i] = value; update(key, copy)
  }
  const removeTag = (key, i) => update(key, form[key].filter((_, idx) => idx !== i))
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorList([])
    setGlobalError('')
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
        blocs: (form.blocs || []).map(b => ({
          ...b,
          planImages: (b.planImages || []).filter(pi => (pi.img || '').trim() || (pi.caption || '').trim() || (pi.id || '').trim()),
          organisation: { ...b.organisation, items: b.organisation.items.filter(i => i.trim()) },
          consignes: { ...b.consignes, items: b.consignes.items.filter(i => i.trim()) },
          roles: { ...b.roles, items: b.roles.items.filter(i => i.trim()) },
        })),
        categories: form.categories.filter(c => c.trim()),
        subThemes: form.subThemes.filter(s => s.trim()),
      }
 
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
 
      const raw = await res.text()
      let json = {}
      try {
        json = raw ? JSON.parse(raw) : {}
      } catch {
        console.error('Réponse non-JSON du serveur:', raw)
      }
 
      if (!res.ok) {
        console.error('Erreur API', res.status, json)
        const details = parseServerErrors(json)
        if (details.length > 0) {
          setErrorList(details)
        } else {
          setGlobalError(`Erreur ${res.status} : la requête a été refusée par le serveur.`)
        }
        return
      }
 
      router.push('/dashboard/exercices')
    } catch (err) {
      console.error('Erreur réseau/JS:', err)
      setGlobalError(err.message || 'Erreur réseau : impossible de contacter le serveur.')
    } finally {
      setSaving(false)
    }
  }
 
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
      {(errorList.length > 0 || globalError) && (
        <div style={{ background: 'rgba(229,57,53,0.15)', border: '1px solid rgba(229,57,53,0.4)', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: errorList.length ? '8px' : 0 }}>
            <AlertCircle size={16} color="#E53935" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, color: '#E53935' }}>
              {errorList.length > 0 ? `${errorList.length} problème(s) à corriger` : 'Erreur'}
            </span>
          </div>
          {globalError && (
            <p style={{ color: '#E53935', fontSize: '13px', fontFamily: 'Inter, sans-serif', margin: 0 }}>{globalError}</p>
          )}
          {errorList.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {errorList.map((msg, i) => (
                <li key={i} style={{ color: '#E53935', fontSize: '13px', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
 
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
 
      <label style={labelStyle}>Image principale (URL, optionnelle)</label>
      <input style={inputStyle} value={form.image} onChange={e => update('image', e.target.value)} placeholder="https://..." />
 
      <label style={labelStyle}>Image détaillée (page exercice, optionnelle)</label>
      <input style={inputStyle} value={form.detail_image || ''} onChange={e => update('detail_image', e.target.value)} placeholder="https://..." />
 
      <p style={sectionTitle}>Galerie photos (optionnelle)</p>
      {(form.images || []).map((img, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input style={inputStyle} placeholder="URL de l'image" value={img} onChange={e => updateImage(i, e.target.value)} />
          <button type="button" onClick={() => removeImage(i)} style={btnRemove}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={addImage} style={btnAdd}><Plus size={13} /> Ajouter une image</button>
 
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
 
      <p style={sectionTitle}>Exercices de la séance (blocs)</p>
      <p style={{ ...helperText, marginTop: '-4px', marginBottom: '16px' }}>
        Ajoute un bloc par exercice que tu veux inclure sur cette page. Chaque bloc a sa propre image,
        sa propre vidéo, ses propres images de plan, et ses propres organisation / consignes / rôles —
        tous optionnels.
      </p>
 
      {(form.blocs || []).map((bloc, bi) => (
        <div key={bi} style={blocBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: '#C8A84B' }}>Exercice {bi + 1}</span>
            <button type="button" onClick={() => removeBloc(bi)} style={btnRemove}><Trash2 size={14} /></button>
          </div>
 
          <label style={labelStyle}>Titre du bloc (optionnel)</label>
          <input style={inputStyle} placeholder="ex: Échauffement, Atelier passes..." value={bloc.title} onChange={e => updateBlocField(bi, 'title', e.target.value)} />
 
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Image du bloc (optionnelle)</label>
              <input style={inputStyle} placeholder="https://..." value={bloc.image} onChange={e => updateBlocField(bi, 'image', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Vidéo du bloc (optionnelle)</label>
              <input style={inputStyle} placeholder="https://..." value={bloc.video} onChange={e => updateBlocField(bi, 'video', e.target.value)} />
            </div>
          </div>
 
          <div style={nestedBox}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, color: '#DDD', marginBottom: '4px' }}>
              Images du plan de séance (optionnelles)
            </p>
            <p style={helperText}>Peu importe la taille/le format de l'image, elle sera affichée entière dans une case uniforme.</p>
            {bloc.planImages.map((pi, i) => (
              <div key={i} style={{ ...blockBox, marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, color: '#C8A84B' }}>Image {i + 1}</span>
                  <button type="button" onClick={() => removeBlocPlanImage(bi, i)} style={btnRemove}><Trash2 size={14} /></button>
                </div>
                <input style={inputStyle} placeholder="Repère (ex: 1/4)" value={pi.id} onChange={e => updateBlocPlanImage(bi, i, 'id', e.target.value)} />
                <input style={{ ...inputStyle, marginTop: '8px' }} placeholder="URL de l'image" value={pi.img} onChange={e => updateBlocPlanImage(bi, i, 'img', e.target.value)} />
                <textarea style={{ ...inputStyle, minHeight: '50px', marginTop: '8px' }} placeholder="Légende" value={pi.caption} onChange={e => updateBlocPlanImage(bi, i, 'caption', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={() => addBlocPlanImage(bi)} style={btnAdd}><Plus size={13} /> Ajouter une image de plan</button>
          </div>
 
          {['organisation', 'consignes', 'roles'].map(key => (
            <div key={key} style={nestedBox}>
              <input style={inputStyle} placeholder="Titre de la section" value={bloc[key].title} onChange={e => updateBlocNested(bi, `${key}.title`, e.target.value)} />
              <label style={labelStyle}>Points</label>
              {bloc[key].items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <textarea style={{ ...inputStyle, minHeight: '50px' }} value={item} onChange={e => updateBlocTextItem(bi, key, i, e.target.value)} />
                  <button type="button" onClick={() => removeBlocTextItem(bi, key, i)} style={btnRemove}><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addBlocTextItem(bi, key)} style={btnAdd}><Plus size={13} /> Ajouter un point</button>
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={addBloc} style={btnAdd}><Plus size={13} /> Ajouter un exercice (bloc)</button>
 
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