import { useMemo, useState } from 'react'
import './App.css'

import { getDailyWord } from './game/daily'
import type { CEFRLevel } from './game/types'
import { validateGuess } from './game/validateGuess'
import { isValidWord, normalizeWord } from './game/wordUtils'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']
const WORD_LENGTHS = [5, 6, 7, 8]

function App() {
  const [level, setLevel] = useState<CEFRLevel>('A1')
  const [wordLength, setWordLength] = useState(5)
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [results, setResults] = useState<string[][]>([])
  const [message, setMessage] = useState('')

  const dailyWord = useMemo(
    () => getDailyWord(level, wordLength),
    [level, wordLength]
  )

  function resetGame(
    nextLevel = level,
    nextLength = wordLength
  ) {
    setGuesses([])
    setResults([])
    setGuess('')
    setMessage('')
    setLevel(nextLevel)
    setWordLength(nextLength)
  }

  function submitGuess() {
    const cleanGuess = normalizeWord(guess)
    const target = normalizeWord(dailyWord.word)

    if (guesses.length >= 6) {
      setMessage(`Spiel vorbei. Das Wort war: ${dailyWord.word}`)
      return
    }

    if (cleanGuess.length !== target.length) {
      setMessage(`Das Wort muss ${target.length} Buchstaben haben.`)
      return
    }

    if (!isValidWord(cleanGuess)) {
      setMessage('Dieses Wort ist nicht in der Wörtle-Liste.')
      return
    }

    const validation = validateGuess(cleanGuess, target)

    const nextGuesses = [...guesses, cleanGuess]
    const nextResults = [...results, validation]

    setGuesses(nextGuesses)
    setResults(nextResults)
    setGuess('')

    if (cleanGuess === target) {
      setMessage('Richtig! 🎉')
    } else if (nextGuesses.length === 6) {
      setMessage(`Verloren. Das Wort war: ${dailyWord.word}`)
    } else {
      setMessage('')
    }
  }

  return (
    <main className="app">
      <h1>Wörtle</h1>

      <p className="subtitle">
        Deutsches Wordle · Level {dailyWord.level} · {dailyWord.length} Buchstaben
      </p>

      <div className="settings">
        <select
          value={level}
          onChange={(e) =>
            resetGame(e.target.value as CEFRLevel, wordLength)
          }
        >
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={wordLength}
          onChange={(e) =>
            resetGame(level, Number(e.target.value))
          }
        >
          {WORD_LENGTHS.map((item) => (
            <option key={item} value={item}>
              {item} Buchstaben
            </option>
          ))}
        </select>
      </div>

      <div className="board">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const rowGuess = guesses[rowIndex] || ''
          const rowResult = results[rowIndex] || []

          return (
            <div key={rowIndex} className="row">
              {Array.from({ length: dailyWord.word.length }).map((_, colIndex) => {
                const letter = rowGuess[colIndex] || ''
                const state = rowResult[colIndex] || ''

                return (
                  <div key={colIndex} className={`tile ${state}`}>
                    {letter}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="controls">
        <input
          type="text"
          value={guess}
          maxLength={dailyWord.word.length}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitGuess()
          }}
          placeholder="Wort eingeben..."
        />

        <button onClick={submitGuess}>
          Enter
        </button>
      </div>

      {message && (
        <p className="message">
          {message}
        </p>
      )}
    </main>
  )
}

export default App
