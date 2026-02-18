import { AlertTriangle } from 'lucide-react'

export function RedFlagBanner({ flags }) {
  if (!flags.length) return null

  return (
    <div style={{
      background: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: 10,
      padding: '10px 14px',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <AlertTriangle size={14} color="#EF4444" />
        <span style={{ fontWeight: 700, fontSize: 12, color: '#DC2626' }}>ESCALATION ALERTS</span>
      </div>
      {flags.map((f, i) => (
        <div key={i} style={{ fontSize: 12, color: '#7F1D1D', marginTop: 2, paddingLeft: 20 }}>
          {f.message}
        </div>
      ))}
    </div>
  )
}
