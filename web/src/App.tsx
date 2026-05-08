import { useEffect, useMemo, useState } from 'react'
import './App.css'

import { getDailyWord } from './game/daily'
import type { CEFRLevel } from './game/types'
import { validateGuess, type TileState } from './game/validateGuess'
import { getRandomWord, normalizeWord } from './game/wordUtils'
import { setupDiscordAuth } from './discord'

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

const LEVELS: CEFRLevel[] = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1'
]

const KEYBOARD = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'y', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
]

function App() {
  const [discordUser, setDiscordUser] =
    useState<any>(null)

  const [mode, setMode] =
    useState<GameMode>('Heute')

  const [level, setLevel] =
    useState<CEFRLevel>('A1')

  const [guess, setGuess] =
    useState('')

  const [guesses, setGuesses] =
    useState<string[]>([])

  const [results, setResults] =
    useState<TileState[][]>([])

  const [message, setMessage] =
    useState('')

  const [gameOver, setGameOver] =
    useState(false)

  const [showProgress, setShowProgress] =
    useState(false)

  const [randomSeed, setRandomSeed] =
    useState(0)

  useEffect(() => {
    setupDiscordAuth()
      .then((user) => {
        if (user) setDiscordUser(user)
      })
      .catch(console.error)
  }, [])

  const targetWord = useMemo(() => {
    if (mode === 'Heute') {
      return getDailyWord(level, 5)
    }

    return getRandomWord(level, 5)
  }, [mode, level, randomSeed])

  const keyboardStates = useMemo(() => {
    const states: Record<string, TileState> = {}

    guesses.forEach((word, rowIndex) => {
      word.split('').forEach((letter, colIndex) => {
        const state = results[rowIndex]?.[colIndex]
        const oldState = states[letter]

        if (state === 'correct') {
          states[letter] = 'correct'
        } else if (
          state === 'present' &&
          oldState !== 'correct'
        ) {
          states[letter] = 'present'
        } else if (!oldState) {
          states[letter] = 'absent'
        }
      })
    })

    return states
  }, [guesses, results])

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
    setGameOver(false)

    setRandomSeed((value) => value + 1)
  }

  function submitGuess() {
    if (gameOver) return

    const cleanGuess =
      normalizeWord(guess)

    const target =
      normalizeWord(targetWord.word)

    if (cleanGuess.length !== target.length) {
      setMessage(
        `Das Wort muss ${target.length} Buchstaben haben.`
      )

      return
    }

    const validation =
      validateGuess(cleanGuess, target)

    const nextGuesses = [
      ...guesses,
      cleanGuess
    ]

    const nextResults = [
      ...results,
      validation
    ]

    setGuesses(nextGuesses)
    setResults(nextResults)
    setGuess('')

    if (cleanGuess === target) {
      setMessage('Richtig! 🎉')
      setGameOver(true)
      return
    }

    if (nextGuesses.length === 6) {
      setMessage(
        `Verloren. Das Wort war: ${targetWord.word}`
      )
      setGameOver(true)
      return
    }

    setMessage('')
  }

  function pressKey(key: string) {
    if (gameOver) return

    if (key === 'Enter') {
      submitGuess()
      return
    }

    if (key === '⌫') {
      setGuess((value) =>
        value.slice(0, -1)
      )
      return
    }

    if (
      guess.length <
      targetWord.word.length
    ) {
      setGuess((value) => value + key)
    }
  }

  return (
    <main className="page">
      <header className="header">
        <div className="brand">
          <div className="logo-grid">
            <span className="green" />
            <span />
            <span className="yellow" />
            <span />
          </div>

          <strong>Wörtle</strong>
        </div>

        <div className="header-right">
          {discordUser && (
            <div className="discord-user">
              @{discordUser.username}
            </div>
          )}

          <button
            className="progress-button"
            onClick={() =>
              setShowProgress(true)
            }
          >
            Fortschritt
          </button>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">
          Wordle Deutsch · German Wordle Game
        </p>

        <h1>Wörtle</h1>

        <p className="hero-text">
          Das tägliche deutsche Wortspiel mit CEFR-Leveln.
        </p>
      </section>

      <section className="game-card">
        <div className="controls-row">
          <label>
            Modus

            <select
              value={mode}
              onChange={(event) =>
                resetGame(
                  event.target.value as GameMode,
                  level
                )
              }
            >
              {MODES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Level

            <select
              value={level}
              onChange={(event) =>
                resetGame(
                  mode,
                  event.target.value as CEFRLevel
                )
              }
            >
              {LEVELS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="game-info">
          Modus: <b>{mode}</b> · Level:{' '}
          <b>{targetWord.level}</b>
        </p>

        <div className="board">
          {Array.from({ length: 6 }).map(
            (_, rowIndex) => {
              const rowGuess =
                guesses[rowIndex] || ''

              const rowResult =
                results[rowIndex] || []

              const isCurrentRow =
                rowIndex === guesses.length

              return (
                <div
                  key={rowIndex}
                  className="row"
                >
                  {Array.from({
                    length: targetWord.word.length
                  }).map((_, colIndex) => {
                    const letter =
                      rowGuess[colIndex] ||
                      (isCurrentRow
                        ? guess[colIndex]
                        : '') ||
                      ''

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

        <div className="keyboard">
          {KEYBOARD.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="keyboard-row"
            >
              {row.map((key) => {
                const keyState =
                  keyboardStates[key]

                return (
                  <button
                    key={key}
                    className={`key ${
                      key === 'Enter' || key === '⌫'
                        ? 'wide'
                        : ''
                    } ${keyState || ''}`}
                    onClick={() =>
                      pressKey(key)
                    }
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {message && (
          <p className="message">
            {message}
          </p>
        )}
      </section>

      {showProgress && (
        <div className="modal-backdrop">
          <div className="modal">
            <button
              className="close"
              onClick={() =>
                setShowProgress(false)
              }
            >
              ×
            </button>

            <h2>Dein Fortschritt</h2>

            <p className="modal-subtitle">
              Deine Statistiken
            </p>

            <div className="login-box">
              {discordUser
                ? `Angemeldet als @${discordUser.username}`
                : 'Nicht mit Discord verbunden'}
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
            </div>

            <div className="info-box">
              Regelmäßiges Spielen verbessert den Wortschatz!
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App