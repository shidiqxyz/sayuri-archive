import Reveal from './Reveal'
import { timeline } from '../data/timeline'

export default function Timeline() {
  return (
    <div className="mem-timeline">
      {timeline.map((item, i) => (
        <Reveal key={`${item.year}-${item.title}`} delay={i * 40}>
          <div className="mem-timeline__item">
            <div className="mem-timeline__marker" aria-hidden="true" />
            <div className="mem-timeline__year">{item.year}</div>
            <div className="mem-timeline__body">
              <h3 className="mem-timeline__title">{item.title}</h3>
              <p className="mem-timeline__desc">{item.description}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
