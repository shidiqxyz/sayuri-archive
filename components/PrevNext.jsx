import Link from 'next/link'
import { useRouter } from 'next/router'
import data from '../data/posts.json'

/**
 * Prev/Next navigation.
 * - On a post page: navigates within the SAME month folder.
 * - On a year index page (e.g. /ameba/2010): navigates between years
 *   within the same section (e.g. /ameba/2010 → /ameba/2011).
 */
export default function PrevNext() {
  const router = useRouter()
  const current = router.pathname

  // --- Year index page (section/year) ---
  const parts = current.split('/').filter(Boolean) // e.g. ['ameba','2010']
  if (parts.length === 2 && /^\d{4}$/.test(parts[1])) {
    const section = parts[0]
    const group = data.years.find((y) => y.section === section)
    if (!group) return null
    const idx = group.items.findIndex((y) => y.route === current)
    if (idx === -1) return null
    const prev = idx > 0 ? group.items[idx - 1] : null
    const next = idx < group.items.length - 1 ? group.items[idx + 1] : null
    return (
      <nav className="mem-prevnext" aria-label="Year navigation">
        {prev ? (
          <Link href={prev.route} className="mem-prevnext__btn mem-prevnext__btn--prev">
            <span className="mem-prevnext__label">← {prev.year}</span>
            <span className="mem-prevnext__title">{prev.year}</span>
          </Link>
        ) : (
          <span className="mem-prevnext__btn mem-prevnext__btn--empty" />
        )}
        {next ? (
          <Link href={next.route} className="mem-prevnext__btn mem-prevnext__btn--next">
            <span className="mem-prevnext__label">{next.year} →</span>
            <span className="mem-prevnext__title">{next.year}</span>
          </Link>
        ) : (
          <span className="mem-prevnext__btn mem-prevnext__btn--empty" />
        )}
      </nav>
    )
  }

  // --- Post page (navigate within same month folder) ---
  const posts = data.posts
  const idx = posts.findIndex((p) => p.route === current)
  if (idx === -1) return null

  const currentGroup = current.split('/').slice(0, -1).join('/')
  const groupPosts = posts.filter((p) => {
    const group = p.route.split('/').slice(0, -1).join('/')
    return group === currentGroup
  })

  const groupIdx = groupPosts.findIndex((p) => p.route === current)
  const prev = groupIdx > 0 ? groupPosts[groupIdx - 1] : null
  const next = groupIdx < groupPosts.length - 1 ? groupPosts[groupIdx + 1] : null

  return (
    <nav className="mem-prevnext" aria-label="Post navigation">
      {prev ? (
        <Link href={prev.route} className="mem-prevnext__btn mem-prevnext__btn--prev">
          <span className="mem-prevnext__label">← Previous</span>
          <span className="mem-prevnext__title">{prev.title || prev.route.split('/').pop()}</span>
        </Link>
      ) : (
        <span className="mem-prevnext__btn mem-prevnext__btn--empty" />
      )}

      {next ? (
        <Link href={next.route} className="mem-prevnext__btn mem-prevnext__btn--next">
          <span className="mem-prevnext__label">Next →</span>
          <span className="mem-prevnext__title">{next.title || next.route.split('/').pop()}</span>
        </Link>
      ) : (
        <span className="mem-prevnext__btn mem-prevnext__btn--empty" />
      )}
    </nav>
  )
}
