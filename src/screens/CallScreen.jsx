import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PhoneOff, FileText, ArrowLeft, Clipboard, Shield, CheckCircle2, Plus,
} from 'lucide-react'

import { CARE_PILLARS, STAKEHOLDER_TYPES, QUESTIONS, WORKER_RESPONSES,
         RED_FLAGS, INITIAL_LINES, SCRIPT_RESPONSES } from '../constants'
import { useCARE } from '../hooks/useCARE'
import { CAREPillarTile } from '../components/CAREPillarTile'
import { QuestionCard }   from '../components/QuestionCard'
import { TranscriptLine } from '../components/TranscriptLine'
import { RedFlagBanner }  from '../components/RedFlagBanner'
import { ExitModal }      from '../components/ExitModal'
import { PostCallReport } from '../components/PostCallReport'

export function CallScreen({ stakeholder, onExit }) {
  const [phase, setPhase] = useState('active')           // active | ended
  const [transcript, setTranscript] = useState([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [expandedPillar, setExpandedPillar] = useState(null)
  const [redFlags, setRedFlags] = useState([])
  const [actions, setActions] = useState([])
  const [newAction, setNewAction] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [activeQuestionPillar, setActiveQuestionPillar] = useState('C')
  const [pendingCMQuestion, setPendingCMQuestion] = useState(null)
  const [autoIndex, setAutoIndex] = useState(0)
  const [waitingForWorker, setWaitingForWorker] = useState(false)

  const { coverage, analyseTranscript, getState } = useCARE()
  const transcriptRef = useRef(null)
  const timerRef      = useRef(null)
  const drillRef      = useRef(null)

  const scriptLines = SCRIPT_RESPONSES[stakeholder] || SCRIPT_RESPONSES.worker

  // ── Initialise transcript ────────────────────────────────────────────────────
  useEffect(() => {
    const initial = (INITIAL_LINES[stakeholder] || INITIAL_LINES.worker).map(l => ({ ...l, isNew: false }))
    setTranscript(initial)
    analyseTranscript(initial)
  }, [stakeholder, analyseTranscript])

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  // ── Scroll transcript to bottom ──────────────────────────────────────────────
  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
  }, [transcript])

  // ── Add a line to transcript ─────────────────────────────────────────────────
  const addLine = useCallback((line) => {
    setTranscript(prev => {
      const updated = [...prev, { ...line, isNew: true }]
      analyseTranscript(updated)
      const newFlags = RED_FLAGS.filter(
        rf => rf.pattern.test(line.text) && !redFlags.find(f => f.message === rf.message)
      )
      if (newFlags.length) setRedFlags(p => [...p, ...newFlags])
      return updated
    })
  }, [analyseTranscript, redFlags])

  // ── Injected question: CM speaks first, then worker responds ─────────────────
  useEffect(() => {
    if (!pendingCMQuestion || phase !== 'active') return

    const t1 = setTimeout(() => {
      addLine({ speaker: 'CM', text: pendingCMQuestion })
      setWaitingForWorker(true)

      const lq = pendingCMQuestion.toLowerCase()
      const matchKey = Object.keys(WORKER_RESPONSES).find(k => lq.includes(k))
      const reply = matchKey
        ? WORKER_RESPONSES[matchKey]
        : "That's a good question. Let me think about that... yeah, I'd say things are moving slowly but I'm trying to stay positive."

      const t2 = setTimeout(() => {
        addLine({ speaker: 'Worker', text: reply })
        setWaitingForWorker(false)
        setPendingCMQuestion(null)
      }, 2600)

      return () => clearTimeout(t2)
    }, 800)

    return () => clearTimeout(t1)
  }, [pendingCMQuestion, phase, addLine])

  // ── Auto-drip remaining script lines ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active' || waitingForWorker || pendingCMQuestion) return
    if (autoIndex >= scriptLines.length) return

    drillRef.current = setTimeout(() => {
      const line = scriptLines[autoIndex]
      const alreadyShown = transcript.some(t => t.text === line.text)
      if (!alreadyShown) addLine(line)
      setAutoIndex(i => i + 1)
    }, 3500)

    return () => clearTimeout(drillRef.current)
  }, [phase, autoIndex, waitingForWorker, pendingCMQuestion, scriptLines, addLine, transcript])

  // ── Auto-suggest the most uncovered pillar ───────────────────────────────────
  useEffect(() => {
    const missing = Object.keys(CARE_PILLARS).find(k => getState(k) === 'missing')
    const partial = Object.keys(CARE_PILLARS).find(k => getState(k) === 'partial')
    setActiveQuestionPillar(missing || partial || 'C')
  }, [coverage, getState])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const completeness = Math.round(Object.keys(CARE_PILLARS).filter(k => getState(k) !== 'missing').length / 4 * 100)

  const handleEndCall = () => setPhase('ended')
  const handleAddAction = () => {
    if (newAction.trim()) { setActions(p => [...p, newAction.trim()]); setNewAction('') }
  }

  const handleLogoClick = () => {
    if (transcript.length > 0) { setShowExitModal(true) } else { onExit() }
  }

  const handleInjectQuestion = useCallback((question) => {
    if (phase !== 'active' || waitingForWorker) return
    clearTimeout(drillRef.current)
    setPendingCMQuestion(question)
  }, [phase, waitingForWorker])

  const handleExitAnyway = () => onExit()

  const handleGenerateReportFromModal = () => {
    setShowExitModal(false)
    setShowReport(true)
  }

  const handleReportClose = () => {
    setShowReport(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <button
          onClick={handleLogoClick}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 18,
            color: '#0EA5E9',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: 0,
          }}
          title="Return to home"
        >
          <ArrowLeft size={14} color="#0EA5E9" />
          ClearPath
        </button>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: phase === 'active' ? '#FEF2F2' : '#F3F4F6',
            padding: '4px 10px',
            borderRadius: 20,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: phase === 'active' ? '#EF4444' : '#9CA3AF',
              animation: phase === 'active' ? 'blink 1.5s infinite' : 'none',
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: phase === 'active' ? '#DC2626' : '#6B7280' }}>
              {phase === 'active' ? `Live · ${formatTime(elapsedSeconds)}` : 'Call Ended'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clipboard size={13} color="#9CA3AF" />
            <span style={{ fontSize: 12, color: '#6B7280' }}>Coverage</span>
            <div style={{ width: 60, height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${completeness}%`, height: '100%',
                background: completeness > 70 ? '#10B981' : completeness > 40 ? '#F59E0B' : '#EF4444',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: completeness > 70 ? '#10B981' : '#F59E0B' }}>
              {completeness}%
            </span>
          </div>

          <div style={{ background: '#F0F9FF', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#0369A1', fontWeight: 600 }}>
            {STAKEHOLDER_TYPES[stakeholder]?.label}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          {phase === 'active' && (
            <button
              onClick={handleEndCall}
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'DM Sans', sans-serif" }}
            >
              <PhoneOff size={13} /> End Call
            </button>
          )}
          {phase === 'ended' && (
            <button
              onClick={() => setShowReport(true)}
              style={{ background: '#0EA5E9', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'DM Sans', sans-serif" }}
            >
              <FileText size={13} /> Generate Report
            </button>
          )}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: 'calc(100vh - 53px)' }}>

        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #E5E7EB', overflow: 'hidden' }}>

          {/* CARE tiles */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 }}>
              C.A.R.E. FRAMEWORK COVERAGE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {Object.entries(CARE_PILLARS).map(([key, pillar]) => (
                <CAREPillarTile
                  key={key}
                  letter={key}
                  pillar={pillar}
                  state={getState(key)}
                  isExpanded={expandedPillar === key}
                  onToggle={() => setExpandedPillar(expandedPillar === key ? null : key)}
                />
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div ref={transcriptRef} style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <RedFlagBanner flags={redFlags} />
            {transcript.map((line, i) => (
              <TranscriptLine key={i} line={line} isNew={line.isNew && i === transcript.length - 1} />
            ))}
            {phase === 'active' && (waitingForWorker || autoIndex < scriptLines.length) && (
              <div style={{ display: 'flex', gap: 4, padding: '8px 12px', animation: 'blink 1.2s infinite' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#D1D5DB' }} />)}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 }}>
              AGREED ACTIONS
            </div>
            <div style={{ maxHeight: 80, overflowY: 'auto' }}>
              {actions.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={12} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: '#374151' }}>{a}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddAction()}
                placeholder="Add agreed action..."
                style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 10px', fontSize: 12, outline: 'none', color: '#374151', fontFamily: "'DM Sans', sans-serif" }}
              />
              <button onClick={handleAddAction} style={{ background: '#0EA5E9', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT column — Question suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 }}>
              SUGGESTED QUESTIONS
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Object.entries(CARE_PILLARS).map(([key, pillar]) => {
                const state  = getState(key)
                const active = activeQuestionPillar === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveQuestionPillar(key)}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      border: `2px solid ${active ? pillar.color : '#E5E7EB'}`,
                      borderRadius: 8,
                      background: active ? pillar.color : '#F9FAFB',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, color: active ? '#fff' : pillar.color }}>{key}</div>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: state === 'covered' ? '#10B981' : state === 'partial' ? '#F59E0B' : '#EF4444', position: 'absolute', top: 3, right: 3 }} />
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {phase === 'ended' ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#9CA3AF' }}>
                <FileText size={28} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 13 }}>Call ended. Generate your case report above.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8 }}>
                  {CARE_PILLARS[activeQuestionPillar]?.description} · {STAKEHOLDER_TYPES[stakeholder]?.label}
                  <span style={{ marginLeft: 6, color: '#0EA5E9', fontWeight: 600 }}>· Click "Ask" to inject</span>
                </div>
                {(QUESTIONS[activeQuestionPillar]?.[stakeholder] || QUESTIONS[activeQuestionPillar]?.worker || []).map((q, i) => (
                  <QuestionCard key={`${activeQuestionPillar}-${i}`} question={q} onInject={handleInjectQuestion} />
                ))}
                {getState(activeQuestionPillar) === 'covered' && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#15803D', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <CheckCircle2 size={14} /> This pillar appears well covered. Good work.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Compliance footer */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #E5E7EB', background: '#FFFBEB' }}>
            <div style={{ fontSize: 10, color: '#92400E', display: 'flex', gap: 4, alignItems: 'flex-start' }}>
              <Shield size={10} style={{ flexShrink: 0, marginTop: 1 }} />
              Documentation support only. Not medical or legal advice.
            </div>
          </div>
        </div>
      </div>

      {showExitModal && (
        <ExitModal
          onGenerateReport={handleGenerateReportFromModal}
          onExitAnyway={handleExitAnyway}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      {showReport && (
        <PostCallReport transcript={transcript} stakeholder={stakeholder} onClose={handleReportClose} />
      )}
    </div>
  )
}
