import Head from 'next/head'
import { useRouter } from 'next/router'
import data from '../data/posts.json'

const SITE = 'sayuri-archive'
const BASE_URL = 'https://sayuri-archive.com'

// Static page titles for top-level routes
const STATIC_TITLES = {
  '/': 'sayuri-archive — In loving memory of Sayuri',
  '/archive': 'Archive — sayuri-archive',
  '/timeline': 'Timeline — sayuri-archive',
  '/discography': 'Discography — sayuri-archive',
  '/guestbook': 'Guestbook — sayuri-archive',
  '/fanart': 'Fanart — sayuri-archive',
  '/alasan': 'About — sayuri-archive',
  '/sayuri-yellow': 'Sayuri Yellow — sayuri-archive',
}

function titleFor(pathname) {
  if (STATIC_TITLES[pathname]) return STATIC_TITLES[pathname]

  // Post pages (e.g. /ameba/2011/Oktober/Mi)
  const post = data.posts.find((p) => p.route === pathname)
  if (post) {
    const name = post.title || pathname.split('/').pop()
    return `${name} — sayuri-archive`
  }

  // Year index pages (e.g. /ameba/2010)
  for (const group of data.years) {
    const year = group.items.find((y) => y.route === pathname)
    if (year) {
      return `${group.section} ${year.year} — sayuri-archive`
    }
  }

  // Fallback: use last path segment
  const last = pathname.split('/').filter(Boolean).pop()
  if (last) {
    const pretty = last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    return `${pretty} — sayuri-archive`
  }

  return `${SITE} — In loving memory of Sayuri`
}

export default function HeadManager() {
  const router = useRouter()
  const title = titleFor(router.pathname)
  const url = `${BASE_URL}${router.asPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="An archive in loving memory of Sayuri (さユり / 酸欠少女さユり)." />
      <meta property="og:title" content={title} />
      <meta property="og:description" content="An archive in loving memory of Sayuri (さユり / 酸欠少女さユり)." />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Head>
  )
}
