import Reveal from '../components/Reveal'

const ARCHIVE_GROUPS = [
  {
    label: 'Blog Archives',
    items: [
      { title: 'Ameba', href: '/ameba' },
      { title: 'Hatena Blog', href: '/hatenablog' },
      { title: 'Tumblr', href: '/tumblr' },
      { title: 'Sayuri Yellow', href: '/sayuri-yellow' },
    ],
  },
  {
    label: 'Memorial',
    items: [
      { title: 'Fanart', href: '/fanart' },
      { title: 'Timeline', href: '/timeline' },
      { title: 'Discography', href: '/discography' },
      { title: 'Guestbook', href: '/guestbook' },
    ],
  },
]

export default function Archive() {
  return (
    <div className="mem-archive-page">
      <Reveal>
        <header className="mem-archive-page__header">
          <p className="mem-archive-page__eyebrow">Memorial</p>
          <h1 className="mem-section-title">The Archive</h1>
          <p className="mem-section-sub">
            Every word and image she left behind, kept safe here.
          </p>
        </header>
      </Reveal>

      {ARCHIVE_GROUPS.map((group) => (
        <section key={group.label} className="mem-archives__group">
          <Reveal>
            <h2 className="mem-archives__group-label">
              <span className="mem-archives__group-line" aria-hidden="true" />
              {group.label}
            </h2>
          </Reveal>
          <div className="mem-archives__grid">
            {group.items.map((link, i) => (
              <Reveal key={link.href} delay={i * 60}>
                <a className="mem-card" href={link.href}>
                  <span className="mem-card__title">{link.title}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
