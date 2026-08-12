import MemorialHero from '../components/MemorialHero'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  return (
    <>
      <div className="mem-home-toggle">
        <ThemeToggle />
      </div>
      <MemorialHero />
    </>
  )
}
