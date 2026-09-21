import '../styles/global.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import Link from 'next/link'
import { MDXProvider } from '@mdx-js/react'
import MdxLayout from '../components/MdxLayout'
import HeadManager from '../components/HeadManager'

const components = {
  a: (props) => {
    const href = props.href || ''
    const isExternal = /^https?:\/\//.test(href)
    if (isExternal) {
      return <a {...props} target="_blank" rel="noopener noreferrer" />
    }
    return <Link {...props} />
  },
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', 'G-RQLP7E1FTL', { page_path: url })
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <HeadManager />
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-RQLP7E1FTL" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RQLP7E1FTL');
          `,
        }}
      />
      <div>
        <MDXProvider components={components}>
          <MdxLayout>
            <Component {...pageProps} />
          </MdxLayout>
        </MDXProvider>
      </div>
    </>
  )
}