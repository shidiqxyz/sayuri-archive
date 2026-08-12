import { useState } from 'react'
import Reveal from './Reveal'

const MAX_CANDLES = 12

export default function Candle() {
  const [candles, setCandles] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('mem-candles') || '[]')
    } catch {
      return []
    }
  })
  const [name, setName] = useState('')

  const lightCandle = (e) => {
    e.preventDefault()
    const label = name.trim() || 'Anonymous'
    const next = [...candles, { id: Date.now(), name: label }].slice(-MAX_CANDLES)
    setCandles(next)
    setName('')
    try {
      localStorage.setItem('mem-candles', JSON.stringify(next))
    } catch {
      /* storage unavailable — ignore */
    }
  }

  return (
    <section id="candle" className="mem-candle">
      <div className="mem-candle__inner">
        <Reveal>
          <h2 className="mem-section-title">Light a candle</h2>
          <p className="mem-candle__intro">
            Leave a small light for Sayuri. It only takes a moment.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mem-candle__row" aria-label="Lit candles">
            {Array.from({ length: MAX_CANDLES }).map((_, i) => {
              const candle = candles[i]
              return (
                <div
                  key={i}
                  className={`mem-candle__slot ${candle ? 'is-lit' : ''}`}
                  title={candle ? candle.name : 'Empty'}
                >
                  {candle && (
                    <>
                      <span className="mem-candle__flame" aria-hidden="true" />
                      <span className="mem-candle__body" aria-hidden="true" />
                      <span className="mem-candle__name">{candle.name}</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={250}>
          <form className="mem-candle__form" onSubmit={lightCandle}>
            <input
              className="mem-input"
              type="text"
              maxLength={40}
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Your name"
            />
            <button className="mem-btn mem-btn--primary" type="submit">
              Light a candle
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
