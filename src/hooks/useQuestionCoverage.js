import { useMemo } from 'react'
import { QUESTIONS } from '../constants'

/**
 * For a given pillar + stakeholder + transcript, returns questions split into:
 *   uncovered: not yet discussed — show at top, Ask button active
 *   covered:   signals detected in transcript — show greyed at bottom
 *
 * Detection: a question is "covered" if ANY of its signal keywords appear
 * anywhere in the full transcript text (case-insensitive).
 */
export function useQuestionCoverage(pillar, stakeholder, transcript) {
  return useMemo(() => {
    const fullText = transcript.map(l => l.text).join(' ').toLowerCase()

    const questions = QUESTIONS[pillar]?.[stakeholder]
      || QUESTIONS[pillar]?.worker
      || []

    const uncovered = []
    const covered   = []

    for (const q of questions) {
      const isCovered = q.signals.some(signal => fullText.includes(signal.toLowerCase()))
      if (isCovered) {
        covered.push(q)
      } else {
        uncovered.push(q)
      }
    }

    return { uncovered, covered }
  }, [pillar, stakeholder, transcript])
}
