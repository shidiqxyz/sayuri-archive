import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import PrevNext from './PrevNext'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { title: 'Archive', href: '/archive' },
  {
    title: 'Blogs',
    children: [
      { title: 'Ameba', href: '/ameba' },
      { title: 'Hatena Blog', href: '/hatenablog' },
      { title: 'Tumblr', href: '/tumblr' },
      { title: 'Sayuri Yellow', href: '/sayuri-yellow' },
    ],
  },
  {
    title: 'Memorial',
    children: [
      { title: 'Fanart', href: '/fanart' },
      { title: 'Timeline', href: '/timeline' },
      { title: 'Discography', href: '/discography' },
      { title: 'Guestbook', href: '/guestbook' },
    ],
  },
]

function NavItem({ item, router }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Plain link
  if (!item.children) {
    const active =
      item.href === '/' ? router.pathname === '/' : router.pathname.startsWith(item.href)
    return (
      <Link
        href={item.href}
        className={`mem-nav__link ${active ? 'is-active' : ''}`}
      >
        {item.title}
      </Link>
    )
  }

  // Dropdown
  const active = item.children.some((c) => router.pathname.startsWith(c.href))

  return (
    <div
      className={`mem-nav__dropdown ${open ? 'is-open' : ''}`}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`mem-nav__link mem-nav__toggle ${active ? 'is-active' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {item.title}
        <span className="mem-nav__caret" aria-hidden="true" />
      </button>
      {open && (
        <div className="mem-nav__menu">
          <div className="mem-nav__menu-inner">
            {item.children.map((child) => {
              const childActive = router.pathname.startsWith(child.href)
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`mem-nav__menu-link ${childActive ? 'is-active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {child.title}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Custom layout that replaces the Nextra docs theme.
 * Wraps every MDX page (except the home page) with a memorial header,
 * article body, and footer.
 */
export default function MdxLayout({ children }) {
  const router = useRouter()
  const isHome = router.pathname === '/'

  if (isHome) {
    return <>{children}</>
  }

  return (
    <div className="mem-site">
      <header className="mem-header">
        <div className="mem-header__inner">
          <Link href="/" className="mem-header__brand">
            sayuri-archive
          </Link>
          <div className="mem-header__navrow">
            <nav className="mem-nav" aria-label="Main navigation">
              {NAV.map((item) => (
                <NavItem key={item.title} item={item} router={router} />
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mem-main">
        <article className="mem-article">{children}</article>
        <PrevNext />
      </main>

      <footer className="mem-footer">
        <div className="mem-footer__inner">
          <p className="mem-footer__text">
            sayuri-archive — {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}