/**
 * Generates a static ordered index of all archive posts and year index pages
 * so the layout can render Prev/Next navigation.
 *
 * Output: data/posts.json
 *  - posts: ordered list of post pages (for post-level prev/next)
 *  - years: ordered list of year index pages grouped by section
 *    (for year-level prev/next, e.g. /ameba/2010 → /ameba/2011)
 */
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '..', 'pages')
const OUT_FILE = path.join(__dirname, '..', 'data', 'posts.json')

function walk(dir, base = '') {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...walk(full, rel))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      results.push(rel)
    }
  }
  return results
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

// Extract a readable title from the first Latin-script `#` heading.
function extractTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const headings = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('# '))
    .map((line) => line.replace(/^#\s+/, '').trim())

  if (headings.length === 0) return null

  const latin = headings.find((h) => {
    const ascii = (h.match(/[A-Za-z0-9]/g) || []).length
    return ascii > 0 && ascii / h.length > 0.5
  })

  return latin || headings[0]
}

function build() {
  const all = walk(PAGES_DIR)

  // Posts: section/year/month/post or sayuri-yellow/sub/post
  const posts = all
    .filter((rel) => !rel.endsWith('/index.mdx'))
    .filter((rel) => rel.split('/').length >= 3)
    .sort(naturalCompare)
    .map((rel) => {
      const route = '/' + rel.replace(/\.mdx$/, '')
      const title = extractTitle(path.join(PAGES_DIR, rel))
      return { route, title }
    })

  // Year index pages: section/year/index.mdx (e.g. ameba/2010/index.mdx)
  // Grouped by section so prev/next stays within the same blog.
  const yearGroups = {}
  for (const rel of all) {
    if (!rel.endsWith('/index.mdx')) continue
    const parts = rel.split('/')
    // section/year/index.mdx → parts length 3
    if (parts.length !== 3) continue
    const section = parts[0]
    const year = parts[1]
    if (!/^\d{4}$/.test(year)) continue
    if (!yearGroups[section]) yearGroups[section] = []
    yearGroups[section].push({ route: `/${section}/${year}`, year })
  }

  const years = Object.entries(yearGroups).map(([section, list]) => ({
    section,
    items: list.sort((a, b) => a.year.localeCompare(b.year)),
  }))

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ posts, years }, null, 2)
  )
  console.log(
    `Generated ${posts.length} posts and ${years.length} year sections → data/posts.json`
  )
}

build()
