import { useReducer, useMemo } from 'react'
import { computeWarnings } from '../lib/compatibility.js'
import { autoSuggest } from '../lib/autoSuggest.js'
import { usePlants } from '../context/PlantsContext.jsx'

function gridReducer(state, action) {
  switch (action.type) {
    case 'SET_BED_META': {
      const next = { ...state, bed: action.bed }
      if (action.placements !== undefined) next.placements = action.placements
      if (action.selectedPlantIds !== undefined) next.selectedPlantIds = action.selectedPlantIds
      return next
    }

    case 'TOGGLE_PLANT_SELECTED': {
      const { plantId } = action
      const isSelected = state.selectedPlantIds.includes(plantId)
      const selectedPlantIds = isSelected
        ? state.selectedPlantIds.filter(id => id !== plantId)
        : [...state.selectedPlantIds, plantId]
      return { ...state, selectedPlantIds }
    }

    case 'APPLY_SUGGESTION': {
      const { placements, excluded } = action
      return { ...state, placements, excludedPlantIds: excluded }
    }

    case 'MOVE_PLANT': {
      // Move plant from sourceCellIndex to targetCellIndex.
      // If target is occupied, swap.
      const { from, to } = action
      const cellMap = Object.fromEntries(state.placements.map(p => [p.cellIndex, p.plantId]))

      const movingPlant = cellMap[from]
      if (!movingPlant) return state

      const displaced = cellMap[to]
      let newPlacements = state.placements.filter(
        p => p.cellIndex !== from && p.cellIndex !== to
      )
      newPlacements.push({ cellIndex: to, plantId: movingPlant })
      if (displaced) {
        newPlacements.push({ cellIndex: from, plantId: displaced })
      }

      return { ...state, placements: newPlacements }
    }

    case 'PLACE_PLANT': {
      // Place a plant from the selector into a specific cell (replaces existing)
      const { cellIndex, plantId } = action
      const newPlacements = state.placements.filter(p => p.cellIndex !== cellIndex)
      newPlacements.push({ cellIndex, plantId })
      return { ...state, placements: newPlacements }
    }

    case 'REMOVE_PLANT': {
      const { cellIndex } = action
      return {
        ...state,
        placements: state.placements.filter(p => p.cellIndex !== cellIndex),
      }
    }

    case 'SWAP_EXCLUDED': {
      // Replace a placed plant with an excluded one
      const { placedCellIndex, excludedPlantId } = action
      const cellMap = Object.fromEntries(state.placements.map(p => [p.cellIndex, p.plantId]))
      const removedPlantId = cellMap[placedCellIndex]

      const newPlacements = state.placements.filter(p => p.cellIndex !== placedCellIndex)
      newPlacements.push({ cellIndex: placedCellIndex, plantId: excludedPlantId })

      const newExcluded = state.excludedPlantIds
        .filter(id => id !== excludedPlantId)
        .concat(removedPlantId ? [removedPlantId] : [])

      return { ...state, placements: newPlacements, excludedPlantIds: newExcluded }
    }

    default:
      return state
  }
}

/**
 * Active grid state wrapper for BedPlannerPage.
 * @param {object|null} initialBed
 */
export function useGrid(initialBed, initialSelectedPlantIds, initialPlacements) {
  const { plantsById } = usePlants()

  const [state, dispatch] = useReducer(gridReducer, {
    bed: initialBed,
    selectedPlantIds: initialSelectedPlantIds ?? [],
    placements: initialPlacements ?? [],
    excludedPlantIds: [],
  })

  // Derive warnings from current placements — never stored in the reducer
  const warnings = useMemo(
    () => state.bed
      ? computeWarnings(state.placements, state.bed.width, state.bed.height, plantsById)
      : {},
    [state.placements, state.bed, plantsById]
  )

  function setBedMeta(bed, placements, selectedPlantIds) {
    dispatch({ type: 'SET_BED_META', bed, placements, selectedPlantIds })
  }

  function togglePlantSelected(plantId) {
    dispatch({ type: 'TOGGLE_PLANT_SELECTED', plantId })
  }

  function applySuggestion() {
    if (!state.bed) return
    // Count how many cells each plant type occupies in the current layout.
    // selectedPlantIds is a deduplicated list (each type appears once), so we
    // expand it using placement counts so autoSuggest sees e.g. ['tomato',
    // 'tomato'] when the user has two tomato cells, not just ['tomato'].
    const placementCounts = {}
    for (const p of state.placements) {
      placementCounts[p.plantId] = (placementCounts[p.plantId] || 0) + 1
    }
    const expandedPlantIds = state.selectedPlantIds.flatMap(id =>
      Array(Math.max(placementCounts[id] || 0, 1)).fill(id)
    )
    const result = autoSuggest(expandedPlantIds, state.bed.width, state.bed.height, plantsById)
    dispatch({ type: 'APPLY_SUGGESTION', placements: result.placements, excluded: result.excluded })
  }

  function movePlant(from, to) {
    dispatch({ type: 'MOVE_PLANT', from, to })
  }

  function placePlant(cellIndex, plantId) {
    dispatch({ type: 'PLACE_PLANT', cellIndex, plantId })
  }

  function removePlant(cellIndex) {
    dispatch({ type: 'REMOVE_PLANT', cellIndex })
  }

  function swapExcluded(placedCellIndex, excludedPlantId) {
    dispatch({ type: 'SWAP_EXCLUDED', placedCellIndex, excludedPlantId })
  }

  return {
    state: { ...state, warnings },
    setBedMeta,
    togglePlantSelected,
    applySuggestion,
    movePlant,
    placePlant,
    removePlant,
    swapExcluded,
  }
}
