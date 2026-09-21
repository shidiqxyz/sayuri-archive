import MemorialHero from '../components/MemorialHero'
import SiteHeader from '../components/SiteHeader'
import ArchiveIndex from '../components/ArchiveIndex'

export default function Home() {
  return (
    <>
      <MemorialHero />
      <SiteHeader revealOnScroll />
      <ArchiveIndex />
    </>
  )
}
