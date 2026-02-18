import { useState } from 'react'
import { Check } from 'lucide-react'

export function QuestionCard({ question, onInject }) {
  const [used, setUsed] = useState(false)

  const handle = () => {
    if (used) return
    setUsed(true)
    onInject(question)
  }

  return (
    <div style={{
      background: used ? '#F0FDF4' : '#fff',
      border: `1px solid ${used ? '#86EFAC' : '#E5E7EB'}`,
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 6,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      transition: 'all 0.2s ease',
    }}>
      <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: used ? '#15803D' : '#374151' }}>
        {question}
      </div>
      <button
        onClick={handle}
        disabled={used}
        style={{
          background: used ? '#DCFCE7' : '#0EA5E9',
          color: used ? '#15803D' : '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 11,
          fontWeight: 600,
          cursor: used ? 'default' : 'pointer',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}
      >
        {used ? <><Check size={10} /> Used</> : 'Ask'}
      </button>
    </div>
  )
}
