/**
 * Migrates images stored inside pages/ to public/ so Next.js can serve them.
 *
 * Next.js only serves static assets from public/. Images referenced with
 * relative paths (./foo.jpg) inside MDX files under pages/ are NOT served.
 *
 * This script:
 *  1. Copies every image file from pages/ to public/ (mirroring the folder
 *     structure, so pages/sayuri-yellow/photo/1/image_0.jpg →
 *     public/sayuri-yellow/photo/1/image_0.jpg).
 *  2. Rewrites markdown image references in MDX files from relative paths
 *     (./x.jpg, ./sub/x.jpg) to absolute paths (/sayuri-yellow/photo/1/x.jpg).
 *
 * Run: node scripts/migrate-images.js
 */
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '..', 'pages')
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

function walk(dir, base = '', filter) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...walk(full, rel, filter))
    } else if (entry.isFile() && filter(entry.name)) {
      results.push(rel)
    }
  }
  return results
}

function copyImages() {
  const images = walk(PAGES_DIR, '', (name) =>
    IMAGE_EXT.includes(path.extname(name).toLowerCase())
  )
  let copied = 0
  for (const rel of images) {
    const src = path.join(PAGES_DIR, rel)
    const dest = path.join(PUBLIC_DIR, rel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    copied++
  }
  console.log(`Copied ${copied} images → public/`)
  return images
}

function rewriteMdx() {
  const mdxFiles = walk(PAGES_DIR, '', (name) => name.endsWith('.mdx'))
  let changed = 0
  for (const rel of mdxFiles) {
    const filePath = path.join(PAGES_DIR, rel)
    const dir = path.dirname(rel) // e.g. sayuri-yellow/photo/1
    let content = fs.readFileSync(filePath, 'utf8')
    const original = content

    // Rewrite ![alt](./path) → ![alt](/dir/path)
    content = content.replace(
      /!\[([^\]]*)\]\((\.[^)]*)\)/g,
      (match, alt, ref) => {
        // ref like ./image_0.jpg or ./1/image_0.jpg
        const clean = ref.replace(/^\.\//, '')
        const absolute = '/' + path.posix.join(dir, clean)
        return `![${alt}](${absolute})`
      }
    )

    if (content !== original) {
      fs.writeFileSync(filePath, content)
      changed++
    }
  }
  console.log(`Rewrote image refs in ${changed} MDX files`)
}

copyImages()
rewriteMdx()
