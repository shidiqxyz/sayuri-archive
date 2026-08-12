import { useState, useEffect } from 'react'
import Reveal from '../components/Reveal'

const FANARTS = [
  {
    src: '/fanart/1.jpeg',
    artist: 'farizmv_',
    link: 'https://www.instagram.com/farizmv_/',
  },
  {
    src: '/fanart/2.jpg',
    artist: 'dilz_arts',
    link: 'https://www.instagram.com/dilz_arts/',
  },
  {
    src: '/fanart/3.png',
    artist: '620_aa0',
    link: 'https://www.instagram.com/620_aa0/',
  },
  {
    src: '/fanart/4.png',
    artist: 'Chintya Loei',
    link: 'https://web.facebook.com/chintyaloei#',
  },
  {
    src: '/fanart/5.png',
    artist: 'KID',
    link: 'https://www.instagram.com/kkid.___',
  },
]

export default function Fanart() {
  const [active, setActive] = useState(null)

  // Close on Escape
  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.addEventListener('keydown', onKey)
    // Prevent body scroll while lightbox is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <div className="mem-fanart">
      <Reveal>
        <h1 className="mem-section-title">Fanart</h1>
        <p className="mem-section-sub">
          A collection of fanart for Sayuri. Click an image to zoom.
        </p>
      </Reveal>

      <div className="mem-fanart__grid">
        {FANARTS.map((art, i) => (
          <Reveal key={art.src} delay={i * 60}>
            <figure className="mem-fanart__card">
              <button
                type="button"
                className="mem-fanart__imgbtn"
                onClick={() => setActive(art)}
                aria-label={`Zoom fanart by ${art.artist}`}
              >
                <img
                  src={art.src}
                  alt={`Fanart by ${art.artist}`}
                  className="mem-fanart__img"
                  loading="lazy"
                />
              </button>
              <figcaption className="mem-fanart__caption">
                <span className="mem-fanart__label">Artist:</span>{' '}
                <a
                  href={art.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mem-fanart__artist"
                >
                  {art.artist}
                </a>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          className="mem-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Fanart by ${active.artist}`}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="mem-lightbox__close"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={active.src}
            alt={`Fanart by ${active.artist}`}
            className="mem-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="mem-lightbox__caption">
            Artist:{' '}
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mem-fanart__artist"
            >
              {active.artist}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
