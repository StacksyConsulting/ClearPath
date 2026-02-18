import { User, Building2, Stethoscope, Scale, Phone } from 'lucide-react'
import { STAKEHOLDER_TYPES } from '../constants'

const ICONS = { worker: User, employer: Building2, medical: Stethoscope, legal: Scale }

export function SetupScreen({ stakeholder, setStakeholder, onStart }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0C4A6E 0%, #0EA5E9 50%, #38BDF8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 40,
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 32, color: '#0EA5E9', letterSpacing: -1 }}>
            ClearPath
          </div>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            Workers' Compensation AI Case Assistant
          </div>
        </div>

        {/* Stakeholder selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Who are you speaking with?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(STAKEHOLDER_TYPES).map(([key, st]) => {
              const Icon = ICONS[key]
              const sel = stakeholder === key
              return (
                <button
                  key={key}
                  onClick={() => setStakeholder(key)}
                  style={{
                    background: sel ? st.color : '#F9FAFB',
                    border: `2px solid ${sel ? st.color : '#E5E7EB'}`,
                    borderRadius: 12,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={16} color={sel ? '#fff' : st.color} style={{ marginBottom: 4 }} />
                  <div style={{ fontWeight: 700, fontSize: 13, color: sel ? '#fff' : '#111827' }}>{st.label}</div>
                  <div style={{ fontSize: 11, color: sel ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: 2 }}>{st.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Framework info */}
        <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: '#0369A1', marginBottom: 3 }}>C.A.R.E. Framework Active</div>
          <div style={{ fontSize: 12, color: '#0C4A6E' }}>Capacity · Alignment · Recovery Barriers · Engagement</div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '14px 20px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Phone size={16} /> Begin Call Session
        </button>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#9CA3AF' }}>
          Documentation support only · Not medical or legal advice
        </div>
      </div>
    </div>
  )
}
