import words from './words.json'

export function getDailyWord() {
  const today = new Date().toISOString().split('T')[0]

  let hash = 0

  for (let i = 0; i < today.length; i++) {
    hash += today.charCodeAt(i)
  }

  return words[hash % words.length]
}