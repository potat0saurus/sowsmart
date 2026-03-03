/**
 * remove-bg-api.mjs
 *
 * Uses the remove.bg API to remove backgrounds from the first LIMIT icons
 * (sorted alphabetically). Overwrites the originals in public/icons/ with
 * the clean transparent PNGs returned by the API.
 *
 * Setup:
 *   1. Sign up at https://www.remove.bg/
 *   2. Copy your API key from https://www.remove.bg/dashboard#api-key
 *   3. Create a file called .env.local in the project root and add:
 *        REMOVE_BG_API_KEY=your_key_here
 *      (This file is already in .gitignore so it won't be committed.)
 *
 * Usage:
 *   node scripts/remove-bg-api.mjs
 *
 * After this, run remove-bg.mjs to flood-fill the remaining icons.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ICONS_DIR = 'public/icons'

// Number of icons to process — matches the free-tier credit limit.
const LIMIT = 50

// ── Load API key ──────────────────────────────────────────────────────────────
let apiKey = process.env.REMOVE_BG_API_KEY

if (!apiKey && existsSync('.env.local')) {
  const env = readFileSync('.env.local', 'utf8')
  const match = env.match(/^REMOVE_BG_API_KEY=(.+)$/m)
  if (match) apiKey = match[1].trim()
}

if (!apiKey) {
  console.error([
    'ERROR: REMOVE_BG_API_KEY not found.',
    '',
    'Add it to .env.local:',
    '  REMOVE_BG_API_KEY=your_key_here',
    '',
    'Get your key at: https://www.remove.bg/dashboard#api-key',
  ].join('\n'))
  process.exit(1)
}

// ── Process icons ─────────────────────────────────────────────────────────────
const files = readdirSync(ICONS_DIR)
  .filter(f => f.endsWith('.png'))
  .sort()
  .slice(0, LIMIT)

console.log(`Sending ${files.length} icons to remove.bg API...\n`)

let ok = 0, fail = 0

for (const file of files) {
  const filePath = join(ICONS_DIR, file)

  try {
    const formData = new FormData()
    const blob = new Blob([readFileSync(filePath)], { type: 'image/png' })
    formData.append('image_file', blob, file)
    formData.append('size', 'auto')

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: formData,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.errors?.[0]?.title ?? `HTTP ${res.status}`)
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    writeFileSync(filePath, buffer)
    console.log(`  ✓ ${file}`)
    ok++
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message}`)
    fail++
  }
}

console.log(`\nDone! ${ok} processed${fail ? `, ${fail} failed` : ''}.`)
console.log(`\nNext step: run  node scripts/remove-bg.mjs  for the remaining icons.`)
