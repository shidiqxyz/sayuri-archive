import { DiscussionEmbed } from 'disqus-react'
import { useRouter } from 'next/router'

// Replace with your Disqus site shortname (the part before .disqus.com).
const DISQUS_SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || ''

export default function Guestbook() {
  const router = useRouter()

  if (!DISQUS_SHORTNAME) {
    return (
      <div className="mem-guestbook__placeholder">
        <p>
          The guestbook is almost ready. Add your Disqus shortname to enable it:
        </p>
        <code>NEXT_PUBLIC_DISQUS_SHORTNAME=your-shortname</code>
      </div>
    )
  }

  return (
    <div className="mem-guestbook">
      <DiscussionEmbed
        shortname={DISQUS_SHORTNAME}
        config={{
          url: `https://sayuri-archive.com${router.asPath}`,
          identifier: router.asPath,
          title: 'Guestbook — Sayuri Archive',
        }}
      />
    </div>
  )
}
