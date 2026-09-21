/**
 * One-time rewrite of local image references (/...) to Vercel Blob URLs.
 *
 * Uses data/blob-manifest.json. Only touches exact manifest keys inside
 * markdown links ![..](..), <img src=".."> and JS string literals.
 * Safe to re-run (blob URLs are not re-matched).
 *
 * Usage: node scripts/rewrite-blob-refs.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'blob-manifest.json'), 'utf8')
)

function collectFiles(dir, exts) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...collectFiles(full, exts))
    } else if (entry.isFile() && exts.has(path.extname(entry.name))) {
      out.push(full)
    }
  }
  return out
}

const files = [
  ...collectFiles(path.join(ROOT, 'pages'), new Set(['.mdx', '.jsx'])),
  ...collectFiles(path.join(ROOT, 'components'), new Set(['.jsx'])),
]

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let totalFiles = 0
let totalRefs = 0

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = 0
  for (const [rel, url] of Object.entries(manifest.files)) {
    // Match '/rel' inside quotes/parens: "(/x)" '...' "..."
    const re = new RegExp(`(['"(])/${escapeRe(rel)}(?=['")])`, 'g')
    content = content.replace(re, (m, open) => {
      changed++
      return open + url
    })
  }
  if (changed > 0) {
    fs.writeFileSync(file, content)
    totalFiles++
    totalRefs += changed
  }
}

console.log(`Rewrote ${totalRefs} refs in ${totalFiles} files`)

// Report any leftover local refs pointing at moved images
const leftovers = []
const relSet = new Set(Object.keys(manifest.files))
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  for (const m of content.matchAll(/['"(]\/([^'"()\s]+)['")]/g)) {
    if (relSet.has(m[1])) leftovers.push(`${path.relative(ROOT, file)}: /${m[1]}`)
  }
}
if (leftovers.length > 0) {
  console.error(`LEFTOVER ${leftovers.length} local refs:`)
  leftovers.slice(0, 20).forEach((l) => console.error('  ' + l))
  process.exit(1)
}
console.log('No leftover local refs to moved images')
