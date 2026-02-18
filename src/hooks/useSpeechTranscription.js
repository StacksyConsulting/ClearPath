import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Manages microphone access and live speech-to-text via the Web Speech API.
 *
 * Returns:
 *   micState        — 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'
 *   isListening     — bool, true while recognition is active
 *   requestMic()    — ask for permission and start listening
 *   stopListening() — stop recognition
 *   onLine          — callback prop: called with { text, isFinal } whenever speech is detected
 *
 * Speaker labelling:
 *   The Web Speech API gives us a single stream with no speaker diarisation.
 *   We alternate speaker labels on silence gaps > SPEAKER_SWITCH_MS.
 *   The first speaker is always labelled "CM" (case manager).
 *   The second alternating speaker label comes from the `otherLabel` prop.
 */

const SPEAKER_SWITCH_MS = 2200   // silence gap that triggers a speaker switch

export function useSpeechTranscription({ onLine, otherLabel = 'Speaker' }) {
  const [micState, setMicState]     = useState('idle')    // idle | requesting | granted | denied | unsupported
  const [isListening, setIsListening] = useState(false)

  const recognitionRef   = useRef(null)
  const currentSpeakerRef = useRef('CM')                  // who is currently speaking
  const silenceTimerRef  = useRef(null)
  const interimRef       = useRef('')                     // buffer for interim results

  const switchSpeaker = useCallback(() => {
    currentSpeakerRef.current = currentSpeakerRef.current === 'CM' ? otherLabel : 'CM'
  }, [otherLabel])

  const resetSilenceTimer = useCallback(() => {
    clearTimeout(silenceTimerRef.current)
    silenceTimerRef.current = setTimeout(() => {
      // Silence gap detected — next speech is likely the other person
      switchSpeaker()
    }, SPEAKER_SWITCH_MS)
  }, [switchSpeaker])

  const stopListening = useCallback(() => {
    clearTimeout(silenceTimerRef.current)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const requestMic = useCallback(async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMicState('unsupported')
      return
    }

    setMicState('requesting')

    try {
      // Explicitly request mic permission first so we can catch denial cleanly
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicState('granted')
    } catch {
      setMicState('denied')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous      = true
    recognition.interimResults  = true
    recognition.lang            = 'en-AU'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      currentSpeakerRef.current = 'CM'
    }

    recognition.onresult = (event) => {
      resetSilenceTimer()

      let interimTranscript = ''
      let finalTranscript   = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (finalTranscript.trim()) {
        onLine({
          speaker: currentSpeakerRef.current,
          text: finalTranscript.trim(),
          isFinal: true,
        })
        interimRef.current = ''
      } else if (interimTranscript.trim()) {
        interimRef.current = interimTranscript.trim()
        onLine({
          speaker: currentSpeakerRef.current,
          text: interimTranscript.trim(),
          isFinal: false,
        })
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setMicState('denied')
        stopListening()
      }
      // 'no-speech' and 'aborted' are expected — just restart
    }

    recognition.onend = () => {
      // Auto-restart if we didn't intentionally stop
      if (recognitionRef.current) {
        try { recognitionRef.current.start() } catch { /* already started */ }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      setMicState('denied')
    }
  }, [onLine, resetSilenceTimer, stopListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(silenceTimerRef.current)
      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
      }
    }
  }, [])

  return { micState, isListening, requestMic, stopListening }
}
