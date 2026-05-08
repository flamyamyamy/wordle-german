export type TileState =
  | 'correct'
  | 'present'
  | 'absent'

export function validateGuess(
  guess: string,
  target: string
): TileState[] {
  const result: TileState[] = []

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result.push('correct')
    } else if (target.includes(guess[i])) {
      result.push('present')
    } else {
      result.push('absent')
    }
  }

  return result
}