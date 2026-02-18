import { useState, useCallback } from 'react'
import { CARE_PILLARS } from '../constants'

export function useCARE() {
  const [coverage, setCoverage] = useState({ C: 0, A: 0, R: 0, E: 0 })

  const analyseTranscript = useCallback((lines) => {
    const fullText = lines.map(l => l.text).join(' ').toLowerCase()
    const next = {}
    for (const [key, pillar] of Object.entries(CARE_PILLARS)) {
      const hits = pillar.keywords.filter(kw => fullText.includes(kw)).length
      next[key] = Math.min(hits / (pillar.keywords.length * 0.4), 1)
    }
    setCoverage(next)
  }, [])

  const getState = useCallback((key) => {
    const v = coverage[key]
    if (v >= 0.7)  return 'covered'
    if (v >= 0.25) return 'partial'
    return 'missing'
  }, [coverage])

  return { coverage, analyseTranscript, getState }
}
