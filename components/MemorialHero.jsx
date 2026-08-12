import Image from 'next/image'
import Reveal from './Reveal'

export default function MemorialHero() {
  return (
    <section className="mem-hero">
      <Image
        src="/bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="mem-hero__bg"
      />

      <div className="mem-hero__overlay" />

      <div className="mem-hero__content">
        <Reveal>
          <p className="mem-hero__eyebrow">In loving memory of</p>
          <h1 className="mem-hero__name">
            さユり <span className="mem-hero__name-en">Sayuri</span>
          </h1>
          <p className="mem-hero__dates">1996 — 2024</p>
        </Reveal>

        <Reveal delay={350}>
          <div className="mem-hero__cta">
            <a className="mem-btn mem-btn--primary" href="/archive">
              Explore the archive
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}