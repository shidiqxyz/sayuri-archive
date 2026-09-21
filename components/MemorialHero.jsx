import Image from 'next/image'

export default function MemorialHero() {
  return (
    <section className="mem-hero">
      <Image
        src="https://s3ll5qqkgio8hxqg.public.blob.vercel-storage.com/bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="mem-hero__bg"
      />

      <div className="mem-hero__overlay" />

      <div className="mem-hero__content">
        <p className="mem-hero__eyebrow">In loving memory of</p>
        <h1 className="mem-hero__name">
          さユり <span className="mem-hero__name-en">Sayuri</span>
        </h1>
        <p className="mem-hero__dates">1996 — 2024</p>

        <div className="mem-hero__cta">
          <a className="mem-hero__link" href="#archive">
            Browse the archive
          </a>
        </div>
      </div>
    </section>
  )
}