import { useState } from 'react'
import { Check, CheckCircle2 } from 'lucide-react'

export function QuestionCard({ question, onInject, alreadyCovered, isDemo }) {
  const [used, setUsed] = useState(false)

  const handle = () => {
    if (used || alreadyCovered || !isDemo) return
    setUsed(true)
    onInject(question.text)
  }

  if (alreadyCovered) {
    return (
      <div style={{
        background: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        padding: '8px 12px',
        marginBottom: 6,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        opacity: 0.55,
      }}>
        <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.4, color: '#6B7280', textDecoration: 'line-through' }}>
          {question.text}
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#10B981', background: '#DCFCE7', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>
          Covered
        </span>
      </div>
    )
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
        {question.text}
      </div>
      {isDemo && (
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
      )}
    </div>
  )
}
