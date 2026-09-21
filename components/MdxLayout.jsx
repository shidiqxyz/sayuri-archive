import { useRouter } from 'next/router'
import PrevNext from './PrevNext'
import SiteHeader from './SiteHeader'

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
      <SiteHeader />

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
