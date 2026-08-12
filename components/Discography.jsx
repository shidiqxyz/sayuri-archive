import Reveal from './Reveal'
import { discography } from '../data/discography'

const TYPES = ['Album', 'Single', 'Digital', 'Collaboration', 'EP']

export default function Discography() {
  return (
    <div className="mem-discography">
      {TYPES.map((type) => {
        const items = discography.filter((d) => d.type === type)
        if (items.length === 0) return null
        return (
          <section key={type} className="mem-discography__group">
            <Reveal>
              <h2 className="mem-discography__type">{type}s</h2>
            </Reveal>
            <ul className="mem-discography__list">
              {items.map((item, i) => (
                <Reveal key={item.title} delay={i * 40} as="li">
                  <a
                    className="mem-discography__item"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="mem-discography__info">
                      <span className="mem-discography__title">{item.title}</span>
                      {item.note && (
                        <span className="mem-discography__note">{item.note}</span>
                      )}
                    </span>
                    <span className="mem-discography__year">{item.year}</span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
