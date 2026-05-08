import { useState } from 'react'

import './App.css'

import { getDailyWord } from './game/daily'
import { validateGuess } from './game/validateGuess'

function App() {
  const dailyWord = getDailyWord()

  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<
    string[]
  >([])

  const [results, setResults] = useState<
    string[][]
  >([])

  function submitGuess() {
    if (
      guess.length !==
      dailyWord.word.length
    ) {
      return
    }

    const validation = validateGuess(
      guess.toLowerCase(),
      dailyWord.word.toLowerCase()
    )

    setGuesses([...guesses, guess])

    setResults([
      ...results,
      validation
    ])

    setGuess('')
  }

  return (
    <main className="app">
      <h1>Wörtle</h1>

      <p className="subtitle">
        German Wordle Game
      </p>

      <div className="board">
        {Array.from({ length: 6 }).map(
          (_, rowIndex) => {
            const rowGuess =
              guesses[rowIndex] || ''

            const rowResult =
              results[rowIndex] || []

            return (
              <div
                key={rowIndex}
                className="row"
              >
                {Array.from({
                  length:
                    dailyWord.word.length
                }).map((_, colIndex) => {
                  const letter =
                    rowGuess[colIndex] || ''

                  const state =
                    rowResult[colIndex] || ''

                  return (
                    <div
                      key={colIndex}
                      className={`tile ${state}`}
                    >
                      {letter}
                    </div>
                  )
                })}
              </div>
            )
          }
        )}
      </div>

      <div className="controls">
        <input
          type="text"
          value={guess}
          maxLength={
            dailyWord.word.length
          }
          onChange={(e) =>
            setGuess(
              e.target.value
            )
          }
          placeholder="Guess..."
        />

        <button
          onClick={submitGuess}
        >
          Enter
        </button>
      </div>
    </main>
  )
}

export default App