import { ChevronDown, ChevronUp } from 'lucide-react'

export function CAREPillarTile({ letter, pillar, state, isExpanded, onToggle }) {
  const cfg = {
    covered: { bg: pillar.color, text: '#fff',    label: 'Covered', border: pillar.color },
    partial:  { bg: '#FEF9C3',   text: '#92400E',  label: 'Partial',  border: '#FCD34D'   },
    missing:  { bg: '#F3F4F6',   text: '#6B7280',  label: 'Missing',  border: '#D1D5DB'   },
  }[state]

  return (
    <div
      onClick={onToggle}
      style={{
        background: cfg.bg,
        border: `2px ${state === 'missing' ? 'dashed' : 'solid'} ${cfg.border}`,
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        animation: state === 'partial' ? 'pulse-amber 2s infinite' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 22,
          color: state === 'covered' ? '#fff' : pillar.color,
          lineHeight: 1,
        }}>
          {letter}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: cfg.text }}>{pillar.label}</div>
          <div style={{ fontSize: 10, color: state === 'covered' ? 'rgba(255,255,255,0.75)' : '#9CA3AF', marginTop: 1 }}>
            {pillar.description}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: cfg.text,
            background: state === 'covered' ? 'rgba(255,255,255,0.2)' : state === 'partial' ? '#FDE68A' : '#E5E7EB',
            padding: '2px 6px',
            borderRadius: 4,
          }}>
            {cfg.label}
          </span>
          {isExpanded ? <ChevronUp size={12} color={cfg.text} /> : <ChevronDown size={12} color={cfg.text} />}
        </div>
      </div>
    </div>
  )
}
