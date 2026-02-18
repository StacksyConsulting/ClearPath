import { X, AlertCircle, CheckCircle2, Download } from 'lucide-react'
import { CARE_PILLARS, STAKEHOLDER_TYPES } from '../constants'

export function PostCallReport({ transcript, stakeholder, onClose }) {
  const text = transcript.map(l => l.text).join(' ').toLowerCase()
  const has = (kws) => kws.some(k => text.includes(k))

  const sections = {
    C: has(['doctor','physio','treatment','six weeks'])
      ? "Worker is receiving physiotherapy twice weekly under the care of a treating doctor. Approximately six weeks until potential return-to-work subject to specialist review. No surgery planned at this stage."
      : "Capacity assessment was not fully explored during this call. Follow up with treating doctor for formal capacity assessment.",

    A: has(['employer','manager','workplace'])
      ? "Limited contact with employer noted. Worker has not responded to manager's initial outreach. Case manager to facilitate employer contact and explore modified duties."
      : "Employer alignment not discussed. Schedule employer contact to explore suitable duties availability.",

    R: has(['anxious','worried','financial','mortgage','stress'])
      ? "Worker expressed anxiety about return to a physical environment. Financial stress related to mortgage noted. Referral to financial counsellor recommended. No legal representation at this stage."
      : "Psychosocial barriers not fully explored. Consider wellbeing check-in at next contact.",

    E: has(['appointment','physio','plan'])
      ? "Worker attending treatment appointments consistently. Expressed openness to RTW planning once medical clearance obtained. Engagement level: cooperative."
      : "Engagement level requires further assessment. Confirm appointment attendance at next contact.",
  }

  const actions = [
    'Follow up with treating doctor regarding formal capacity certificate',
    'Facilitate introduction between worker and employer to re-establish contact',
    'Issue financial counsellor referral letter',
    'Draft suitable duties plan once employer contact made',
    'Schedule next case review in two weeks',
  ]

  const riskLevel = has(['anxious','worried','financial','not going back']) ? 'Medium' : 'Low'
  const riskColor = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' }[riskLevel]

  const exportText =
    `CASE CONTACT NOTE\nAI-Assisted Summary — Documentation Support Only\n\n` +
    Object.entries(CARE_PILLARS).map(([k, p]) => `${k} — ${p.label.toUpperCase()}\n${sections[k]}`).join('\n\n') +
    `\n\nAGREED ACTIONS\n` + actions.map((a, i) => `${i + 1}. ${a}`).join('\n') +
    `\n\nNEXT REVIEW: 14 days\nRISK LEVEL: ${riskLevel}\nESCALATION: None required\n\n` +
    `This summary is AI-assisted and for documentation support only. Not medical or legal advice.`

  const handleExport = () => {
    const a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportText)
    a.download = 'case-note.txt'
    a.click()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 680,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
          padding: '20px 24px',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
        }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, color: '#fff' }}>
              Case Contact Note
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              AI-Assisted Summary · Documentation Support Only
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#fff' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Disclaimer */}
          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 20,
            fontSize: 12,
            color: '#92400E',
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            This summary is AI-assisted and intended to support documentation only. It does not constitute medical,
            legal, or clinical advice. All content must be reviewed and confirmed by the case manager.
          </div>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>STAKEHOLDER</div>
              <div style={{ fontSize: 14, color: '#111827', fontWeight: 600, marginTop: 2 }}>
                {STAKEHOLDER_TYPES[stakeholder]?.label}
              </div>
            </div>
            <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>RISK RATING</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: riskColor, marginTop: 2 }}>{riskLevel}</div>
            </div>
          </div>

          {/* C.A.R.E. sections */}
          {Object.entries(CARE_PILLARS).map(([key, pillar]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: pillar.color }}>{key}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{pillar.label}</span>
              </div>
              <div style={{
                fontSize: 13,
                color: '#374151',
                lineHeight: 1.6,
                background: pillar.bg,
                padding: '10px 12px',
                borderRadius: 8,
                borderLeft: `3px solid ${pillar.color}`,
              }}>
                {sections[key]}
              </div>
            </div>
          ))}

          {/* Actions */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#15803D', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={14} /> Agreed Actions
            </div>
            {actions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981', minWidth: 16 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, color: '#374151' }}>{a}</span>
              </div>
            ))}
          </div>

          {/* Footer summary */}
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0369A1' }}>NEXT REVIEW</div>
              <div style={{ fontSize: 13, color: '#0C4A6E', fontWeight: 600 }}>In 14 days</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0369A1' }}>ESCALATION</div>
              <div style={{ fontSize: 13, color: '#0C4A6E', fontWeight: 600 }}>None required</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0369A1' }}>RISK LEVEL</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: riskColor }}>{riskLevel}</div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleExport}
              style={{
                flex: 1,
                background: '#0EA5E9',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Download size={14} /> Export Case Note
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
