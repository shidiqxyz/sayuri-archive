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
      <header className="mem-archive-page__header">
        <h1 className="mem-section-title">Archive</h1>
      </header>

      {ARCHIVE_GROUPS.map((group) => (
        <section key={group.label} className="mem-archives__group">
          <h2 className="mem-archives__group-label">{group.label}</h2>
          <div className="mem-archives__grid">
            {group.items.map((link) => (
              <a key={link.href} className="mem-card" href={link.href}>
                <span className="mem-card__title">{link.title}</span>
                <span className="mem-card__arrow" aria-hidden="true">
                  &gt;
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
