/**
 * remove-bg.mjs
 *
 * Flood-fill background removal for icons that weren't processed by the API.
 * Skips the first SKIP_FIRST icons (alphabetical) — those are handled by
 * remove-bg-api.mjs. Run this AFTER remove-bg-api.mjs.
 *
 * Also trims an extra slice from the bottom of each icon to remove any
 * residual text label that the crop script might have left.
 *
 * Usage:
 *   node scripts/remove-bg.mjs
 */

import sharp from 'sharp'
import { readdirSync } from 'fs'
import { join } from 'path'

const ICONS_DIR = 'public/icons'

// Skip the first N icons (alphabetical) — they were handled by the remove.bg API.
// Set to 0 to process all icons with flood fill.
const SKIP_FIRST = 50

// Extra slice to remove from the bottom of each icon.
// Removes any residual text label the crop script left behind.
const EXTRA_BOTTOM_TRIM = 0.10

// Pixels with R, G, B all >= (255 - THRESHOLD) are treated as background.
// 20 allows for slight off-white / anti-aliased edges.
const BG_THRESHOLD = 20

/**
 * Flood-fill from every edge pixel.
 * Any white/near-white pixel reachable from an edge is made fully transparent.
 * Modifies the RGBA buffer in place.
 */
function removeWhiteBackground(data, width, height) {
  const visited = new Uint8Array(width * height)
  const stack = []

  function enqueue(x, y) {
    const idx = y * width + x
    if (!visited[idx]) {
      visited[idx] = 1
      stack.push(idx)
    }
  }

  for (let x = 0; x < width; x++) {
    enqueue(x, 0)
    enqueue(x, height - 1)
  }
  for (let y = 1; y < height - 1; y++) {
    enqueue(0, y)
    enqueue(width - 1, y)
  }

  while (stack.length > 0) {
    const idx = stack.pop()
    const p = idx * 4
    const r = data[p], g = data[p + 1], b = data[p + 2]

    if (r >= 255 - BG_THRESHOLD && g >= 255 - BG_THRESHOLD && b >= 255 - BG_THRESHOLD) {
      data[p + 3] = 0
      const x = idx % width
      const y = Math.floor(idx / width)
      if (x > 0)          enqueue(x - 1, y)
      if (x < width - 1)  enqueue(x + 1, y)
      if (y > 0)          enqueue(x, y - 1)
      if (y < height - 1) enqueue(x, y + 1)
    }
  }
}

async function processIcon(filePath) {
  const { width, height } = await sharp(filePath).metadata()
  const trimH = Math.floor(height * (1 - EXTRA_BOTTOM_TRIM))

  const { data, info } = await sharp(filePath)
    .extract({ left: 0, top: 0, width, height: trimH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  removeWhiteBackground(data, info.width, info.height)

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(filePath)
}

const files = readdirSync(ICONS_DIR)
  .filter(f => f.endsWith('.png'))
  .sort()
  .slice(SKIP_FIRST)

if (files.length === 0) {
  console.log('No icons to process (all covered by API batch).')
  process.exit(0)
}

console.log(`Flood-fill processing ${files.length} icon(s) in ./${ICONS_DIR}/\n`)
console.log('Files:', files.join(', '), '\n')

let ok = 0, fail = 0
for (const file of files) {
  try {
    await processIcon(join(ICONS_DIR, file))
    console.log(`  ✓ ${file}`)
    ok++
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message}`)
    fail++
  }
}

console.log(`\nDone! ${ok} processed${fail ? `, ${fail} failed` : ''}.`)
