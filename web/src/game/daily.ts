import type { CEFRLevel } from './types'
import { getFilteredWords, getWordsByLevel } from './wordUtils'

function getDateHash(value: string) {
  let hash = 0

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }

  return hash
}

export function getDailyWord(
  level: CEFRLevel = 'A1',
  length = 5
) {
  const today = new Date()
    .toISOString()
    .split('T')[0]

  let candidates = getFilteredWords(level, length)

  if (candidates.length === 0) {
    candidates = getWordsByLevel(level)
  }

  const hash = getDateHash(`${today}-${level}-${length}`)

  return candidates[hash % candidates.length]
}
