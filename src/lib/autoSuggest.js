/**
 * Auto-suggest layout algorithm.
 * Greedy most-constrained-first placement.
 * Pure functions — zero React, portable to React Native.
 */
import { scorePlacement } from './compatibility.js'

/**
 * Constraint score: plants with more incompatibilities get placed first.
 */
function constraintScore(plantId, plantsById) {
  const plant = plantsById[plantId]
  if (!plant) return 0
  return plant.incompatible.length * 3 + plant.competitors.length
}

/**
 * Generate a suggested layout for the given bed.
 *
 * @param {string[]} selectedPlantIds - plant IDs the user wants to grow
 * @param {number}   width            - bed width in cells
 * @param {number}   height           - bed height in cells
 * @returns {{ placements: Array<{cellIndex: number, plantId: string}>, excluded: string[] }}
 */
export function autoSuggest(selectedPlantIds, width, height, plantsById) {
  const totalCells = width * height
  const placements = []
  const excluded = []

  if (selectedPlantIds.length === 0) {
    return { placements, excluded }
  }

  // Sort by constraint score descending (most constrained first)
  const sorted = [...selectedPlantIds].sort(
    (a, b) => constraintScore(b, plantsById) - constraintScore(a, plantsById)
  )

  // If we have more plants than cells, drop least-constrained plants
  const toPlace = sorted.slice(0, totalCells)
  const overflow = sorted.slice(totalCells)
  excluded.push(...overflow)

  // Track which cells are occupied
  const cellMap = {} // cellIndex → plantId

  for (const plantId of toPlace) {
    // Find the empty cell with the highest compatibility score for this plant
    let bestCell = -1
    let bestScore = -Infinity

    for (let i = 0; i < totalCells; i++) {
      if (cellMap[i] !== undefined) continue
      const s = scorePlacement(plantId, i, cellMap, width, height, plantsById)
      if (s > bestScore || (s === bestScore && bestCell === -1)) {
        bestScore = s
        bestCell = i
      }
    }

    if (bestCell === -1) {
      // No empty cell found (shouldn't happen given slice above, but guard it)
      excluded.push(plantId)
      continue
    }

    cellMap[bestCell] = plantId
    placements.push({ cellIndex: bestCell, plantId })
  }

  return { placements, excluded }
}
