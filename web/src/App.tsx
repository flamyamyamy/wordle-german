import { useState } from 'react'
import './App.css'

import { getDailyWord } from './game/daily'
import { validateGuess } from './game/validateGuess'

function App() {
  const dailyWord = getDailyWord()

  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [results, setResults] = useState<string[][]>([])
  const [message, setMessage] = useState('')

  function submitGuess() {
    const cleanGuess = guess.toLowerCase().trim()
    const target = dailyWord.word.toLowerCase()

    if (cleanGuess.length !== target.length) {
      setMessage(`Das Wort muss ${target.length} Buchstaben haben.`)
      return
    }

    if (guesses.length >= 6) {
      setMessage(`Spiel vorbei. Das Wort war: ${target}`)
      return
    }

    const validation = validateGuess(cleanGuess, target)

    setGuesses([...guesses, cleanGuess])
    setResults([...results, validation])
    setGuess('')

    if (cleanGuess === target) {
      setMessage('Richtig! 🎉')
    } else if (guesses.length === 5) {
      setMessage(`Verloren. Das Wort war: ${target}`)
    } else {
      setMessage('')
    }
  }

  return (
    <main className="app">
      <h1>Wörtle</h1>

      <p className="subtitle">
        German Wordle Game · Level {dailyWord.level}
      </p>

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