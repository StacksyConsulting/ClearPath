export function TranscriptLine({ line, isNew }) {
  const isCM = line.speaker === 'CM'

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      marginBottom: 10,
      animation: isNew ? 'slideIn 0.35s ease' : 'none',
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: isCM ? '#0EA5E9' : '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: isCM ? '#fff' : '#6B7280' }}>
          {isCM ? 'CM' : line.speaker.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: isCM ? '#0369A1' : '#6B7280', marginBottom: 2 }}>
          {line.speaker}
        </div>
        <div style={{
          fontSize: 13,
          color: '#1F2937',
          lineHeight: 1.5,
          background: isCM ? '#EFF6FF' : '#F9FAFB',
          padding: '8px 10px',
          borderRadius: isCM ? '4px 10px 10px 10px' : '10px 10px 10px 4px',
        }}>
          {line.text}
        </div>
      </div>
    </div>
  )
}
