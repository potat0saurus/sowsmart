/**
 * retrim-icons.mjs
 *
 * Crops extra pixels from the bottom of specific icons that still show a text
 * label, then re-applies flood-fill background removal.
 *
 * Usage:
 *   node scripts/retrim-icons.mjs chamomile potato sunflower
 *
 * Pass icon names without the .png extension.
 * TRIM_FRACTION controls how much of the current height to remove from the bottom.
 */

import sharp from 'sharp'
import { existsSync } from 'fs'
import { join } from 'path'

const ICONS_DIR = 'public/icons'

// Remove this fraction from the bottom of the icon.
// Increase if text is still visible after running.
const TRIM_FRACTION = 0.20

const BG_THRESHOLD = 20

function removeWhiteBackground(data, width, height) {
  const visited = new Uint8Array(width * height)
  const stack = []

  function enqueue(x, y) {
    const idx = y * width + x
    if (!visited[idx]) { visited[idx] = 1; stack.push(idx) }
  }

  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1) }
  for (let y = 1; y < height - 1; y++) { enqueue(0, y); enqueue(width - 1, y) }

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

async function retrim(name) {
  const filePath = join(ICONS_DIR, `${name}.png`)
  if (!existsSync(filePath)) {
    console.error(`  ✗ ${name}.png — file not found`)
    return
  }

  const { width, height } = await sharp(filePath).metadata()
  const newH = Math.floor(height * (1 - TRIM_FRACTION))

  const { data, info } = await sharp(filePath)
    .extract({ left: 0, top: 0, width, height: newH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  removeWhiteBackground(data, info.width, info.height)

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(filePath)

  console.log(`  ✓ ${name}.png  (${height}px → ${newH}px)`)
}

const names = process.argv.slice(2)
if (names.length === 0) {
  console.error('Usage: node scripts/retrim-icons.mjs <name1> [name2] ...')
  process.exit(1)
}

console.log(`Retrimming ${names.length} icon(s) (removing bottom ${TRIM_FRACTION * 100}%)\n`)
for (const name of names) await retrim(name)
console.log('\nDone!')
