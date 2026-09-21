import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { title: 'Archive', href: '/#archive' },
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

export default function SiteHeader({ revealOnScroll = false }) {
  const router = useRouter()
  const [visible, setVisible] = useState(!revealOnScroll)

  // On home the header stays hidden over the hero and slides in on scroll.
  useEffect(() => {
    if (!revealOnScroll) return
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight - 120)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [revealOnScroll])

  const headerClass = 'mem-header'
  const wrapClass =
    revealOnScroll === true
      ? `mem-header-wrap--reveal${visible ? ' is-visible' : ''}`
      : undefined

  return (
    <>
      {revealOnScroll && !visible && (
        <div className="mem-home-toggle">
          <ThemeToggle />
        </div>
      )}
      <div className={wrapClass}>
        <header className={headerClass}>
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
    </div>
    </>
  )
}
