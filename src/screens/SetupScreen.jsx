import { useState } from 'react'
import { User, Building2, Stethoscope, Scale, Phone, Radio, Play } from 'lucide-react'
import { STAKEHOLDER_TYPES } from '../constants'

const ICONS = { worker: User, employer: Building2, medical: Stethoscope, legal: Scale }

export function SetupScreen({ stakeholder, setStakeholder, onStart }) {
  const [callMode, setCallMode] = useState('demo')   // 'demo' | 'live'

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

        {/* Call mode toggle */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Call Mode
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => setCallMode('demo')}
              style={{
                background: callMode === 'demo' ? '#0EA5E9' : '#F9FAFB',
                border: `2px solid ${callMode === 'demo' ? '#0EA5E9' : '#E5E7EB'}`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <Play size={16} color={callMode === 'demo' ? '#fff' : '#0EA5E9'} style={{ marginBottom: 6 }} />
              <div style={{ fontWeight: 700, fontSize: 14, color: callMode === 'demo' ? '#fff' : '#111827' }}>
                Demo
              </div>
              <div style={{ fontSize: 11, color: callMode === 'demo' ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: 2, lineHeight: 1.4 }}>
                Simulated call with scripted transcript
              </div>
            </button>

            <button
              onClick={() => setCallMode('live')}
              style={{
                background: callMode === 'live' ? '#10B981' : '#F9FAFB',
                border: `2px solid ${callMode === 'live' ? '#10B981' : '#E5E7EB'}`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <Radio size={16} color={callMode === 'live' ? '#fff' : '#10B981'} style={{ marginBottom: 6 }} />
              <div style={{ fontWeight: 700, fontSize: 14, color: callMode === 'live' ? '#fff' : '#111827' }}>
                Live
              </div>
              <div style={{ fontSize: 11, color: callMode === 'live' ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginTop: 2, lineHeight: 1.4 }}>
                Real call with microphone transcription
              </div>
            </button>
          </div>

          {callMode === 'live' && (
            <div style={{
              marginTop: 10,
              background: '#ECFDF5',
              border: '1px solid #6EE7B7',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              color: '#065F46',
              display: 'flex',
              gap: 6,
              alignItems: 'flex-start',
              animation: 'fadeIn 0.2s ease',
            }}>
              <Radio size={12} style={{ flexShrink: 0, marginTop: 1 }} />
              Microphone access will be requested when the call begins. Transcription uses your browser's built-in speech recognition.
            </div>
          )}
        </div>

        {/* Stakeholder selector — shown in both modes */}
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
          onClick={() => onStart(callMode)}
          style={{
            width: '100%',
            background: callMode === 'live'
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'linear-gradient(135deg, #0EA5E9, #0369A1)',
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
            transition: 'background 0.2s ease',
          }}
        >
          {callMode === 'live'
            ? <><Radio size={16} /> Begin Live Call</>
            : <><Play size={16} /> Begin Demo Call</>
          }
        </button>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#9CA3AF' }}>
          Documentation support only · Not medical or legal advice
        </div>
      </div>
    </div>
  )
}
