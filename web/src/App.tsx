import { useMemo, useState } from 'react'
import './App.css'

import { getDailyWord } from './game/daily'
import type { CEFRLevel } from './game/types'
import { validateGuess } from './game/validateGuess'
import { getRandomWord, isValidWord, normalizeWord } from './game/wordUtils'

type GameMode =
  | 'Heute'
  | 'Training'
  | 'Zufall'
  | 'Wörterbuch'

const MODES: GameMode[] = [
  'Heute',
  'Training',
  'Zufall',
  'Wörterbuch'
]

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

const KEYBOARD = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'y', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
]

function App() {
  const [mode, setMode] = useState<GameMode>('Heute')
  const [level, setLevel] = useState<CEFRLevel>('A1')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [results, setResults] = useState<string[][]>([])
  const [message, setMessage] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [randomSeed, setRandomSeed] = useState(0)

  const targetWord = useMemo(() => {
    if (mode === 'Zufall' || mode === 'Training') {
      return getRandomWord(level, 5)
    }

    return getDailyWord(level, 5)
  }, [mode, level, randomSeed])

  function resetGame(
    nextMode = mode,
    nextLevel = level
  ) {
    setMode(nextMode)
    setLevel(nextLevel)
    setGuess('')
    setGuesses([])
    setResults([])
    setMessage('')
    setRandomSeed((value) => value + 1)
  }

  function submitGuess() {
    const cleanGuess = normalizeWord(guess)
    const target = normalizeWord(targetWord.word)

    if (guesses.length >= 6) {
      setMessage(`Spiel vorbei. Das Wort war: ${targetWord.word}`)
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
      setMessage(`Verloren. Das Wort war: ${targetWord.word}`)
    } else {
      setMessage('')
    }
  }

  function pressKey(key: string) {
    if (key === 'Enter') {
      submitGuess()
      return
    }

    if (key === '⌫') {
      setGuess((current) => current.slice(0, -1))
      return
    }

    if (guess.length < targetWord.word.length) {
      setGuess((current) => current + key)
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <button
          className="progress-button"
          onClick={() => setShowProgress(true)}
        >
          Dein Fortschritt
        </button>
      </header>

      <h1>Wörtle</h1>

      <p className="subtitle">
        Modus: {mode} · Level {targetWord.level}
      </p>

      <div className="settings">
        <select
          value={mode}
          onChange={(e) =>
            resetGame(e.target.value as GameMode, level)
          }
        >
          {MODES.map((item) => (
            <option key={item} value={item}>
              Modus: {item}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) =>
            resetGame(mode, e.target.value as CEFRLevel)
          }
        >
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              Level: {item}
            </option>
          ))}
        </select>
      </div>

      <div className="board">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const rowGuess = guesses[rowIndex] || ''
          const rowResult = results[rowIndex] || []
          const isCurrentRow = rowIndex === guesses.length

          return (
            <div key={rowIndex} className="row">
              {Array.from({ length: targetWord.word.length }).map((_, colIndex) => {
                const letter =
                  rowGuess[colIndex] ||
                  (isCurrentRow ? guess[colIndex] : '') ||
                  ''

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

      <div className="keyboard">
        {KEYBOARD.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className={`key ${
                  key === 'Enter' || key === '⌫' ? 'wide' : ''
                }`}
                onClick={() => pressKey(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      {showProgress && (
        <div className="modal-backdrop">
          <div className="modal">
            <button
              className="close"
              onClick={() => setShowProgress(false)}
            >
              ×
            </button>

            <h2>Dein Fortschritt</h2>

            <p className="modal-subtitle">
              Deine Statistiken auf einen Blick
            </p>

            <div className="login-box">
              Melde dich an, um deinen Fortschritt zu verfolgen und deine Aktivitäts-Heatmap zu sehen!
            </div>

            <div className="stats-grid">
              <div className="stat">
                <span>Aktuelle Serie</span>
                <strong>0 Tage</strong>
              </div>

              <div className="stat">
                <span>Gewinnrate</span>
                <strong>0%</strong>
              </div>

              <div className="stat">
                <span>Spiele gesamt</span>
                <strong>0</strong>
              </div>

              <div className="stat">
                <span>Siege gesamt</span>
                <strong>0</strong>
              </div>

              <div className="stat">
                <span>Längste Serie</span>
                <strong>0 Tage</strong>
              </div>

              <div className="stat">
                <span>Zuletzt gespielt</span>
                <strong>Nie</strong>
              </div>
            </div>

            <div className="info-box">
              Regelmäßiges Spielen verbessert die Worterkennung und den Wortschatz!
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App