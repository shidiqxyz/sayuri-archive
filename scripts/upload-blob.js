/**
 * One-time bulk upload of public/ images to Vercel Blob.
 *
 * - Preserves relative paths as blob pathnames (no random suffix)
 * - Skips files already in the store (resume-friendly)
 * - Writes data/blob-manifest.json { localPath: url }
 *
 * Requires BLOB_READ_WRITE_TOKEN in .env.local (never committed).
 *
 * Usage: node scripts/upload-blob.js
 */
const fs = require('fs')
const path = require('path')
const { put, list } = require('@vercel/blob')

const ROOT = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const MANIFEST_FILE = path.join(ROOT, 'data', 'blob-manifest.json')
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
const CONCURRENCY = 5

function loadEnv() {
  const envFile = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envFile)) return
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

function walkImages(dir, base = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      out.push(...walkImages(full, rel))
    } else if (entry.isFile() && IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push({ full, rel })
    }
  }
  return out
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

async function main() {
  loadEnv()
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('Missing BLOB_READ_WRITE_TOKEN in .env.local')
    process.exit(1)
  }

  const files = walkImages(PUBLIC_DIR).sort((a, b) => a.rel.localeCompare(b.rel))
  console.log(`Found ${files.length} images in public/`)

  // Existing blobs for resume
  const existing = new Set()
  let cursor
  do {
    const res = await list({ cursor, limit: 1000, token })
    for (const b of res.blobs) existing.add(b.pathname)
    cursor = res.cursor
  } while (cursor)
  console.log(`Store already has ${existing.size} blobs`)

  let manifest = { generatedAt: null, baseUrl: null, files: {} }
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'))
    } catch {
      /* start fresh */
    }
  }

  const todo = files.filter((f) => !existing.has(f.rel))
  console.log(`Uploading ${todo.length} new files...`)
  let done = 0
  let bytes = 0

  await mapLimit(todo, CONCURRENCY, async (f) => {
    const body = fs.readFileSync(f.full)
    const blob = await put(f.rel, body, {
      access: 'public',
      addRandomSuffix: false,
      token,
    })
    manifest.files[f.rel] = blob.url
    if (!manifest.baseUrl) {
      manifest.baseUrl = blob.url.slice(0, blob.url.length - f.rel.length)
    }
    done++
    bytes += body.length
    if (done % 25 === 0 || done === todo.length) {
      console.log(`  ${done}/${todo.length} (${(bytes / 1048576).toFixed(1)} MB)`)
    }
  })

  manifest.generatedAt = new Date().toISOString()
  fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true })
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Manifest: ${Object.keys(manifest.files).length} entries → data/blob-manifest.json`)
}

main().catch((err) => {
  console.error('Upload failed:', err.message)
  process.exit(1)
})
