'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ value, onChange, style, required, minLength }) {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        style={{ ...style, paddingRight: '40px' }}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', padding: '4px' }}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}