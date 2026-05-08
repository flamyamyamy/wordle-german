import words from './words.json'
import type { CEFRLevel, WordEntry } from './types'

export const WORDS = words as WordEntry[]

export function normalizeWord(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
}

export function getWordsByLevel(level: CEFRLevel) {
  return WORDS.filter((entry) => entry.level === level)
}

export function getWordsByLength(length: number) {
  return WORDS.filter((entry) => entry.length === length)
}

export function getFilteredWords(
  level: CEFRLevel,
  length = 5
) {
  return WORDS.filter(
    (entry) =>
      entry.level === level &&
      entry.length === length
  )
}

export function isValidWord(value: string) {
  const normalized = normalizeWord(value)

  return WORDS.some(
    (entry) =>
      normalizeWord(entry.word) === normalized
  )
}

export function getRandomWord(
  level: CEFRLevel,
  length = 5
) {
  const filtered = getFilteredWords(level, length)

  if (filtered.length === 0) {
    return getWordsByLevel(level)[0]
  }

  return filtered[
    Math.floor(Math.random() * filtered.length)
  ]
}
