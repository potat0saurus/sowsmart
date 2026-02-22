import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'sowsmart_beds'
const BED_ID = 'playwright-suggest-test'

const TEST_BED = {
  id: BED_ID,
  name: 'Suggest Layout Test',
  width: 4,
  height: 4,
  selectedPlantIds: ['tomato', 'basil'],
  placements: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

test.describe('Suggest layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(
      ({ key, bed }) => {
        const store = { version: 1, beds: { [bed.id]: bed } }
        localStorage.setItem(key, JSON.stringify(store))
      },
      { key: STORAGE_KEY, bed: TEST_BED }
    )
  })

  test('fills the grid with selected plants after clicking Suggest Layout', async ({ page }) => {
    await page.goto(`/#/bed/${BED_ID}`)

    // No plants placed yet — grid should be all empty
    await expect(page.getByRole('gridcell', { name: /at cell/i }).first()).not.toBeVisible()

    // Click Suggest Layout
    await page.getByRole('button', { name: /suggest layout/i }).click()

    // At least one filled cell should appear
    await expect(page.getByRole('gridcell', { name: /at cell/i }).first()).toBeVisible()
  })

  test('does not drop placed plants when duplicates exist', async ({ page }) => {
    // Bed with 2 tomatoes already placed
    const bedWith2Tomatoes = {
      ...TEST_BED,
      id: 'playwright-suggest-dupe-test',
      selectedPlantIds: ['tomato'],
      placements: [
        { cellIndex: 0, plantId: 'tomato' },
        { cellIndex: 1, plantId: 'tomato' },
      ],
    }

    await page.goto('/')
    await page.evaluate(
      ({ key, bed }) => {
        const store = { version: 1, beds: { [bed.id]: bed } }
        localStorage.setItem(key, JSON.stringify(store))
      },
      { key: STORAGE_KEY, bed: bedWith2Tomatoes }
    )

    await page.goto(`/#/bed/${bedWith2Tomatoes.id}`)

    // 2 tomatoes placed
    await expect(page.getByRole('gridcell', { name: /Tomato at cell/i })).toHaveCount(2)

    // Suggest layout — should keep both tomatoes (not collapse to 1)
    await page.getByRole('button', { name: /suggest layout/i }).click()

    await expect(page.getByRole('gridcell', { name: /Tomato at cell/i })).toHaveCount(2)
  })
})
