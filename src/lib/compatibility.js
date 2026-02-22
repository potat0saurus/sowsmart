/**
 * Compatibility / warning computation.
 * Pure functions — zero React, portable to React Native.
 */

/**
 * Get the 4-directional orthogonal neighbours of a cell index in a grid.
 * @param {number} cellIndex
 * @param {number} width  - columns
 * @param {number} height - rows
 * @returns {number[]} array of neighbouring cell indices
 */
export function getNeighbours(cellIndex, width, height) {
  const row = Math.floor(cellIndex / width)
  const col = cellIndex % width
  const neighbours = []
  if (row > 0) neighbours.push(cellIndex - width)          // up
  if (row < height - 1) neighbours.push(cellIndex + width)  // down
  if (col > 0) neighbours.push(cellIndex - 1)               // left
  if (col < width - 1) neighbours.push(cellIndex + 1)       // right
  return neighbours
}

/**
 * Compute per-cell warnings given current placements.
 * @param {Array<{cellIndex: number, plantId: string}>} placements
 * @param {number} width
 * @param {number} height
 * @param {object} plantsById - id → plant lookup map
 * @returns {{ [cellIndex: number]: string[] }} map of cell → warning messages
 */
export function computeWarnings(placements, width, height, plantsById) {
  const cellMap = Object.fromEntries(placements.map(p => [p.cellIndex, p.plantId]))
  const warnings = {}

  for (const { cellIndex, plantId } of placements) {
    const plant = plantsById[plantId]
    if (!plant) continue

    const cellWarnings = []
    const neighbours = getNeighbours(cellIndex, width, height)

    for (const nIdx of neighbours) {
      const nPlantId = cellMap[nIdx]
      if (!nPlantId) continue
      const nPlant = plantsById[nPlantId]
      if (!nPlant) continue

      if (plant.incompatible.includes(nPlantId) || nPlant.incompatible.includes(plantId)) {
        cellWarnings.push(`incompatible:${nPlantId}`)
      } else if (plant.competitors.includes(nPlantId) || nPlant.competitors.includes(plantId)) {
        cellWarnings.push(`competitor:${nPlantId}`)
      }
    }

    if (cellWarnings.length > 0) {
      warnings[cellIndex] = cellWarnings
    }
  }

  return warnings
}

/**
 * Severity level of a cell: 'incompatible' | 'competitor' | null
 */
export function getCellSeverity(warnings, cellIndex) {
  const w = warnings[cellIndex]
  if (!w || w.length === 0) return null
  if (w.some(x => x.startsWith('incompatible'))) return 'incompatible'
  return 'competitor'
}

/**
 * Score a candidate (plantId) being placed at cellIndex, given existing placements.
 * Used by autoSuggest.
 * @param {object} plantsById - id → plant lookup map
 */
export function scorePlacement(plantId, cellIndex, cellMap, width, height, plantsById) {
  const plant = plantsById[plantId]
  if (!plant) return 0

  let score = 0
  const neighbours = getNeighbours(cellIndex, width, height)

  for (const nIdx of neighbours) {
    const nId = cellMap[nIdx]
    if (!nId) continue

    if (plant.companions.includes(nId)) {
      score += 2
    } else if (plant.incompatible.includes(nId)) {
      score -= 5
    } else if (plant.competitors.includes(nId)) {
      score -= 1
    }
  }

  return score
}
