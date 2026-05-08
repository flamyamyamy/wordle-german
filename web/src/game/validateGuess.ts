export type TileState =
  | 'correct'
  | 'present'
  | 'absent'

export function validateGuess(
  guess: string,
  target: string
): TileState[] {
  const normalizedGuess = guess.toLowerCase()
  const normalizedTarget = target.toLowerCase()

  const result: TileState[] =
    Array(normalizedGuess.length).fill('absent')

  const targetLetters =
    normalizedTarget.split('')

  for (let i = 0; i < normalizedGuess.length; i++) {
    if (normalizedGuess[i] === normalizedTarget[i]) {
      result[i] = 'correct'
      targetLetters[i] = ''
    }
  }

  for (let i = 0; i < normalizedGuess.length; i++) {
    if (result[i] === 'correct') continue

    const index = targetLetters.indexOf(normalizedGuess[i])

    if (index !== -1) {
      result[i] = 'present'
      targetLetters[index] = ''
    }
  }

  return result
}
