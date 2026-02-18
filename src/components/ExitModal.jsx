import { AlertCircle, FileText } from 'lucide-react'

export function ExitModal({ onGenerateReport, onExitAnyway, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{
          background: '#FFF7ED',
          borderBottom: '1px solid #FED7AA',
          padding: '16px 20px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <AlertCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#92400E' }}>Unsaved session data</div>
            <div style={{ fontSize: 12, color: '#B45309', marginTop: 3 }}>
              Your transcript and case notes will be lost if you leave without generating a report.
            </div>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <button
            onClick={onGenerateReport}
            style={{
              width: '100%',
              background: '#0EA5E9',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '11px 16px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <FileText size={14} /> Generate Report First
          </button>

          <button
            onClick={onExitAnyway}
            style={{
              width: '100%',
              background: '#F3F4F6',
              color: '#6B7280',
              border: 'none',
              borderRadius: 10,
              padding: '11px 16px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Exit Without Saving
          </button>

          <button
            onClick={onCancel}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#9CA3AF',
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              fontWeight: 500,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel — Stay on This Page
          </button>
        </div>
      </div>
    </div>
  )
}
