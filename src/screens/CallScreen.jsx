import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PhoneOff, FileText, ArrowLeft, Clipboard, Shield, CheckCircle2, Plus,
  Mic, MicOff, Radio, AlertCircle,
} from 'lucide-react'

import { CARE_PILLARS, STAKEHOLDER_TYPES, WORKER_RESPONSES,
         RED_FLAGS, INITIAL_LINES, DEMO_PAIRS } from '../constants'
import { useCARE }                from '../hooks/useCARE'
import { useQuestionCoverage }    from '../hooks/useQuestionCoverage'
import { useSpeechTranscription } from '../hooks/useSpeechTranscription'
import { CAREPillarTile }  from '../components/CAREPillarTile'
import { QuestionCard }    from '../components/QuestionCard'
import { TranscriptLine }  from '../components/TranscriptLine'
import { RedFlagBanner }   from '../components/RedFlagBanner'
import { ExitModal }       from '../components/ExitModal'
import { PostCallReport }  from '../components/PostCallReport'

// ─── LIVE SPEAKER LABEL INFERENCE ─────────────────────────────────────────────
// Infers "CM" vs the other party label by watching the last few lines.
// If the transcript contains any known CM phrases, CM gets the first slot;
// otherwise we just alternate.
function inferSpeakerLabels(transcript) {
  if (transcript.length < 2) return { cmLabel: 'CM', otherLabel: 'Caller' }

  // Count how many lines are attributed to each unique speaker
  const counts = {}
  transcript.forEach(l => { counts[l.speaker] = (counts[l.speaker] || 0) + 1 })
  const speakers = Object.keys(counts)

  if (speakers.length === 0) return { cmLabel: 'CM', otherLabel: 'Caller' }
  if (speakers.length === 1) return { cmLabel: speakers[0], otherLabel: 'Caller' }

  // The speaker with more lines is probably the CM
  const [a, b] = speakers
  const cmLabel = counts[a] >= counts[b] ? a : b
  const otherLabel = cmLabel === a ? b : a
  return { cmLabel, otherLabel }
}

export function CallScreen({ stakeholder, callMode, onExit }) {
  const isDemo = callMode !== 'live'

  const [phase, setPhase]             = useState('active')
  const [transcript, setTranscript]   = useState([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [expandedPillar, setExpandedPillar] = useState(null)
  const [redFlags, setRedFlags]       = useState([])
  const [actions, setActions]         = useState([])
  const [newAction, setNewAction]     = useState('')
  const [showReport, setShowReport]   = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [activeQuestionPillar, setActiveQuestionPillar] = useState('C')

  // Live mode — interim line shown while speech in progress
  const [interimLine, setInterimLine] = useState(null)

  // Demo drip state
  const [pairIndex, setPairIndex]   = useState(0)
  const [dripPhase, setDripPhase]   = useState('cm')

  // Injected question state (Ask button)
  const [pendingCMQuestion, setPendingCMQuestion] = useState(null)
  const [waitingForResponse, setWaitingForResponse] = useState(false)

  const { coverage, analyseTranscript, getState } = useCARE()
  const { uncovered, covered } = useQuestionCoverage(activeQuestionPillar, stakeholder, transcript)
  const transcriptRef = useRef(null)
  const timerRef      = useRef(null)
  const dripRef       = useRef(null)

  // Labels
  const demoResponderLabel = { worker: 'Worker', employer: 'Employer', medical: 'Medical', legal: 'Legal' }[stakeholder] || 'Caller'
  const { cmLabel, otherLabel } = inferSpeakerLabels(transcript)

  // Speech transcription hook (only active in live mode)
  const handleSpeechLine = useCallback(({ speaker, text, isFinal }) => {
    if (isFinal) {
      setInterimLine(null)
      setTranscript(prev => {
        const updated = [...prev, { speaker, text, isNew: true }]
        analyseTranscript(updated)
        RED_FLAGS.forEach(rf => {
          if (rf.pattern.test(text)) {
            setRedFlags(p => p.find(f => f.message === rf.message) ? p : [...p, rf])
          }
        })
        return updated
      })
    } else {
      setInterimLine({ speaker, text })
    }
  }, [analyseTranscript])

  const { micState, isListening, requestMic, stopListening } = useSpeechTranscription({
    onLine: handleSpeechLine,
    otherLabel: STAKEHOLDER_TYPES[stakeholder]?.label || 'Caller',
  })

  // ── Initialise ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isDemo) {
      const initial = (INITIAL_LINES[stakeholder] || INITIAL_LINES.worker).map(l => ({ ...l, isNew: false }))
      setTranscript(initial)
      analyseTranscript(initial)
      setPairIndex(0)
      setDripPhase('cm')
    } else {
      // Live mode — start with empty transcript, request mic immediately
      setTranscript([])
      requestMic()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
  }, [transcript, interimLine])

  // ── Add a line helper (demo) ─────────────────────────────────────────────────
  const addLine = useCallback((line) => {
    setTranscript(prev => {
      const updated = [...prev, { ...line, isNew: true }]
      analyseTranscript(updated)
      RED_FLAGS.forEach(rf => {
        if (rf.pattern.test(line.text)) {
          setRedFlags(p => p.find(f => f.message === rf.message) ? p : [...p, rf])
        }
      })
      return updated
    })
  }, [analyseTranscript])

  // ── Demo auto-drip ───────────────────────────────────────────────────────────
  const pairs = DEMO_PAIRS[stakeholder] || DEMO_PAIRS.worker
  useEffect(() => {
    if (!isDemo) return
    if (phase !== 'active') return
    if (waitingForResponse || pendingCMQuestion) return
    if (pairIndex >= pairs.length) return

    const pair = pairs[pairIndex]

    if (dripPhase === 'cm') {
      dripRef.current = setTimeout(() => {
        addLine({ speaker: 'CM', text: pair.cm })
        setDripPhase('response')
      }, 4000)
    } else if (dripPhase === 'response') {
      dripRef.current = setTimeout(() => {
        addLine({ speaker: demoResponderLabel, text: pair.response })
        setPairIndex(i => i + 1)
        setDripPhase('cm')
      }, 2500)
    }

    return () => clearTimeout(dripRef.current)
  }, [isDemo, phase, pairIndex, dripPhase, pairs, demoResponderLabel, addLine, waitingForResponse, pendingCMQuestion])

  // ── Injected question (Ask button) ───────────────────────────────────────────
  useEffect(() => {
    if (!pendingCMQuestion || phase !== 'active') return
    clearTimeout(dripRef.current)

    const t1 = setTimeout(() => {
      addLine({ speaker: 'CM', text: pendingCMQuestion })
      setWaitingForResponse(true)

      const lq = pendingCMQuestion.toLowerCase()
      const matchKey = Object.keys(WORKER_RESPONSES).find(k => lq.includes(k))
      const reply = matchKey
        ? WORKER_RESPONSES[matchKey]
        : "That's a good question. Let me think about that for a second — yeah, things are moving slowly but I'm trying to stay positive."

      const t2 = setTimeout(() => {
        addLine({ speaker: demoResponderLabel, text: reply })
        setWaitingForResponse(false)
        setPendingCMQuestion(null)
        setDripPhase('cm')
      }, 2500)

      return () => clearTimeout(t2)
    }, 800)

    return () => clearTimeout(t1)
  }, [pendingCMQuestion, phase, addLine, demoResponderLabel])

  // ── Auto-suggest pillar ──────────────────────────────────────────────────────
  useEffect(() => {
    const missing = Object.keys(CARE_PILLARS).find(k => getState(k) === 'missing')
    const partial = Object.keys(CARE_PILLARS).find(k => getState(k) === 'partial')
    setActiveQuestionPillar(missing || partial || 'C')
  }, [coverage, getState])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const completeness = Math.round(Object.keys(CARE_PILLARS).filter(k => getState(k) !== 'missing').length / 4 * 100)

  const handleEndCall = () => {
    clearTimeout(dripRef.current)
    if (!isDemo) stopListening()
    setPhase('ended')
    setInterimLine(null)
  }

  const handleAddAction = () => {
    if (newAction.trim()) { setActions(p => [...p, newAction.trim()]); setNewAction('') }
  }

  const handleLogoClick = () => {
    if (transcript.length > 0) { setShowExitModal(true) } else { onExit() }
  }

  const handleInjectQuestion = useCallback((question) => {
    if (phase !== 'active' || waitingForResponse) return
    clearTimeout(dripRef.current)
    setPendingCMQuestion(question)
  }, [phase, waitingForResponse])

  // Demo typing indicator
  const showDemoTyping = isDemo && phase === 'active' && (
    waitingForResponse || pendingCMQuestion ||
    (dripPhase === 'response' && pairIndex < pairs.length) ||
    (dripPhase === 'cm' && pairIndex < pairs.length)
  )

  // Mic status label
  const micStatusLabel = {
    idle:        'Mic off',
    requesting:  'Requesting mic...',
    granted:     isListening ? 'Listening' : 'Mic ready',
    denied:      'Mic blocked',
    unsupported: 'Not supported',
  }[micState] || 'Mic off'

  const micStatusColor = {
    idle:        '#9CA3AF',
    requesting:  '#F59E0B',
    granted:     isListening ? '#10B981' : '#6B7280',
    denied:      '#EF4444',
    unsupported: '#EF4444',
  }[micState] || '#9CA3AF'

  // Speaker label display for the header badge
  const stakeholderDisplayLabel = isDemo
    ? STAKEHOLDER_TYPES[stakeholder]?.label
    : otherLabel !== 'CM' ? otherLabel : STAKEHOLDER_TYPES[stakeholder]?.label

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
        >
          <ArrowLeft size={14} color="#0EA5E9" />
          ClearPath
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Live / Demo badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: isDemo ? '#EFF6FF' : '#ECFDF5',
            border: `1px solid ${isDemo ? '#BAE6FD' : '#6EE7B7'}`,
            padding: '3px 8px', borderRadius: 20,
          }}>
            {isDemo
              ? <FileText size={10} color="#0369A1" />
              : <Radio size={10} color="#059669" />
            }
            <span style={{ fontSize: 11, fontWeight: 600, color: isDemo ? '#0369A1' : '#059669' }}>
              {isDemo ? 'Demo' : 'Live'}
            </span>
          </div>

          {/* Call status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: phase === 'active' ? '#FEF2F2' : '#F3F4F6',
            padding: '4px 10px', borderRadius: 20,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: phase === 'active' ? '#EF4444' : '#9CA3AF',
              animation: phase === 'active' ? 'blink 1.5s infinite' : 'none',
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: phase === 'active' ? '#DC2626' : '#6B7280' }}>
              {phase === 'active' ? `${isDemo ? '' : ''}${formatTime(elapsedSeconds)}` : 'Call Ended'}
            </span>
          </div>

          {/* Mic status (live only) */}
          {!isDemo && phase === 'active' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              padding: '4px 10px', borderRadius: 20,
            }}>
              {micState === 'denied' || micState === 'unsupported'
                ? <MicOff size={12} color={micStatusColor} />
                : <Mic size={12} color={micStatusColor} style={{ animation: isListening ? 'blink 1.5s infinite' : 'none' }} />
              }
              <span style={{ fontSize: 11, fontWeight: 600, color: micStatusColor }}>{micStatusLabel}</span>
            </div>
          )}

          {/* Coverage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clipboard size={13} color="#9CA3AF" />
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

          {/* Stakeholder label */}
          <div style={{ background: '#F0F9FF', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#0369A1', fontWeight: 600 }}>
            {stakeholderDisplayLabel}
          </div>
        </div>

        {/* Right actions */}
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

        {/* LEFT */}
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

          {/* Mic denied / unsupported warning */}
          {!isDemo && (micState === 'denied' || micState === 'unsupported') && (
            <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertCircle size={14} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, color: '#991B1B' }}>
                {micState === 'denied'
                  ? 'Microphone access was blocked. Please allow microphone permissions in your browser settings and refresh the page.'
                  : 'Your browser does not support speech recognition. Try Chrome or Edge for live transcription.'}
              </div>
            </div>
          )}

          {/* Transcript */}
          <div ref={transcriptRef} style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <RedFlagBanner flags={redFlags} />

            {transcript.length === 0 && !isDemo && micState === 'granted' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#D1D5DB', gap: 8 }}>
                <Mic size={32} style={{ animation: isListening ? 'blink 1.5s infinite' : 'none' }} />
                <div style={{ fontSize: 13 }}>
                  {isListening ? 'Listening — start speaking...' : 'Mic ready. Start speaking to begin.'}
                </div>
              </div>
            )}

            {transcript.map((line, i) => (
              <TranscriptLine key={i} line={line} isNew={line.isNew && i === transcript.length - 1} />
            ))}

            {/* Interim line (live mode — grey, not yet final) */}
            {interimLine && (
              <div style={{ opacity: 0.5, marginBottom: 10 }}>
                <TranscriptLine line={interimLine} isNew={false} />
              </div>
            )}

            {/* Demo typing indicator */}
            {showDemoTyping && (
              <div style={{ display: 'flex', gap: 4, padding: '8px 4px', animation: 'blink 1.2s infinite' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#D1D5DB' }} />
                ))}
              </div>
            )}
          </div>

          {/* Agreed Actions */}
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

        {/* RIGHT — Question suggestions */}
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
                      flex: 1, padding: '5px 4px',
                      border: `2px solid ${active ? pillar.color : '#E5E7EB'}`,
                      borderRadius: 8,
                      background: active ? pillar.color : '#F9FAFB',
                      cursor: 'pointer', position: 'relative', transition: 'all 0.15s ease',
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
                  {CARE_PILLARS[activeQuestionPillar]?.description}
                  {isDemo && <span style={{ marginLeft: 6, color: '#0EA5E9', fontWeight: 600 }}>· Click "Ask" to use</span>}
                </div>

                {uncovered.length === 0 && covered.length > 0 && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#15803D', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                    <CheckCircle2 size={14} /> All key areas for this pillar have been covered.
                  </div>
                )}

                {uncovered.map((q, i) => (
                  <QuestionCard
                    key={`uncovered-${activeQuestionPillar}-${i}`}
                    question={q}
                    onInject={handleInjectQuestion}
                    alreadyCovered={false}
                    isDemo={isDemo}
                  />
                ))}

                {covered.length > 0 && uncovered.length > 0 && (
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', letterSpacing: 0.5, margin: '10px 0 6px', textTransform: 'uppercase' }}>
                    Already discussed
                  </div>
                )}

                {covered.map((q, i) => (
                  <QuestionCard
                    key={`covered-${activeQuestionPillar}-${i}`}
                    question={q}
                    onInject={handleInjectQuestion}
                    alreadyCovered={true}
                    isDemo={isDemo}
                  />
                ))}
              </>
            )}
          </div>

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
          onGenerateReport={() => { setShowExitModal(false); setShowReport(true) }}
          onExitAnyway={onExit}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      {showReport && (
        <PostCallReport transcript={transcript} stakeholder={stakeholder} onClose={() => setShowReport(false)} />
      )}
    </div>
  )
}
