import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'sowsmart_beds'
const BED_ID = 'playwright-persistence-test'

const TEST_BED = {
  id: BED_ID,
  name: 'Persistence Test',
  width: 4,
  height: 4,
  selectedPlantIds: ['tomato'],
  placements: [{ cellIndex: 0, plantId: 'tomato' }],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

// Seed localStorage before every test in this file
async function seedBed(page) {
  await page.goto('/')
  await page.evaluate(
    ({ key, bed }) => {
      const store = { version: 1, beds: { [bed.id]: bed } }
      localStorage.setItem(key, JSON.stringify(store))
    },
    { key: STORAGE_KEY, bed: TEST_BED }
  )
}

test.describe('Plant persistence', () => {
  test('placements survive navigate-away-and-back', async ({ page }) => {
    await seedBed(page)

    // Open the bed — tomato should be visible in cell 1
    await page.goto(`/#/bed/${BED_ID}`)
    await expect(page.getByRole('gridcell', { name: /Tomato at cell 1/i })).toBeVisible()

    // Navigate back to the home page
    await page.getByRole('link', { name: '← All beds' }).click()

    // Navigate back to the bed
    await page.goto(`/#/bed/${BED_ID}`)

    // Placement must still be there — this is the bug we're verifying
    await expect(
      page.getByRole('gridcell', { name: /Tomato at cell 1/i })
    ).toBeVisible()
  })

  test('placements survive a full page reload', async ({ page }) => {
    await seedBed(page)

    await page.goto(`/#/bed/${BED_ID}`)
    await expect(page.getByRole('gridcell', { name: /Tomato at cell 1/i })).toBeVisible()

    await page.reload()

    await expect(
      page.getByRole('gridcell', { name: /Tomato at cell 1/i })
    ).toBeVisible()
  })
})
