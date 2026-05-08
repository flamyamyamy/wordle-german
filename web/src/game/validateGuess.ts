export type TileState =
  | 'correct'
  | 'present'
  | 'absent'

export function validateGuess(
  guess: string,
  target: string
): TileState[] {
  const result: TileState[] =
    Array(guess.length).fill('absent')

  const targetLetters = target.split('')

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
      targetLetters[i] = ''
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue

    const index = targetLetters.indexOf(guess[i])

    if (index !== -1) {
      result[i] = 'present'
      targetLetters[index] = ''
    }
  }

  return result
}