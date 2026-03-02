/**
 * crop-icons.mjs
 *
 * Crops each 2x2 batch grid image into individual icon files,
 * renames them to match plant IDs, and saves to public/icons/.
 *
 * Usage:
 *   node scripts/crop-icons.mjs
 *
 * To add a new batch, add an entry to the BATCHES array below.
 */

import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = 'public/icons'
mkdirSync(OUTPUT_DIR, { recursive: true })

/**
 * Each entry maps a source image to output icon names.
 * Order is: top-left, top-right, bottom-left, bottom-right.
 * cols/rows defaults to 2x2. Override for non-standard grids.
 */
const BATCHES = [
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_40_19 PM.png',
    icons: ['artichoke', 'asparagus', 'avocado', 'bamboo_sprouts'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_41_45 PM.png',
    icons: ['beans', 'beetroot', 'broccoli', 'brussel_sprouts'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_45_13 PM.png',
    icons: ['cabbage', 'carrot', 'cauliflower', 'celery'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_46_19 PM.png',
    icons: ['cherry_tomatoes', 'chili_pepper', 'chinese_cabbage', 'chives'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_48_30 PM.png',
    icons: ['corn', 'cucumber', 'daikon', 'eggplant'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_49_26 PM.png',
    icons: ['fennel', 'garlic', 'ginger', 'green_beans'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_50_34 PM.png',
    icons: ['horseradish', 'kale', 'kohlrabi', 'leek'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_53_25 PM.png',
    icons: ['lettuce', 'mushroom', 'olives', 'onion'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_54_21 PM.png',
    icons: ['paprika', 'parsley_root', 'parsnip', 'peas'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_55_38 PM.png',
    icons: ['potato', 'pumpkin', 'pumpkin_2', 'radish'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 01_57_35 PM.png',
    icons: ['soybeans', 'spinach', 'spring_onion', 'squash'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 02_01_47 PM.png',
    icons: ['sweet_potato', 'tomato', 'turnip', 'wasabi'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 02_02_50 PM.png',
    icons: ['watercress', 'zucchini', 'strawberry', 'bell_pepper'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 02_03_44 PM.png',
    icons: ['basil', 'dill', 'marigold', 'nasturtium'],
  },
  {
    file: 'ChatGPT Image Mar 1, 2026, 02_04_41 PM.png',
    icons: ['chamomile', 'sunflower'],
    cols: 2,
    rows: 1,
  },
]

// Fraction of each cell height to keep — trims the text label at the bottom
const HEIGHT_FRACTION = 0.78

async function processBatch(batch) {
  if (!existsSync(batch.file)) {
    console.warn(`  SKIPPED (file not found): ${batch.file}`)
    return
  }

  const cols = batch.cols ?? 2
  const rows = batch.rows ?? 2
  const meta = await sharp(batch.file).metadata()
  const cellW = Math.floor(meta.width / cols)
  const cellH = Math.floor(meta.height / rows)
  const cropH = Math.floor(cellH * HEIGHT_FRACTION)

  for (let i = 0; i < batch.icons.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const name = batch.icons[i]
    const outPath = join(OUTPUT_DIR, `${name}.png`)

    await sharp(batch.file)
      .extract({
        left: col * cellW,
        top: row * cellH,
        width: cellW,
        height: cropH,
      })
      .png()
      .toFile(outPath)

    console.log(`  ✓ ${name}.png`)
  }
}

async function main() {
  console.log(`Saving icons to ./${OUTPUT_DIR}/\n`)

  for (const batch of BATCHES) {
    console.log(`Processing: ${batch.file}`)
    await processBatch(batch)
  }

  console.log('\nDone!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
