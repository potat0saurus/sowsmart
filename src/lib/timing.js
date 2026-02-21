/**
 * Zone band lookups and timing helpers.
 * Pure functions — zero React, portable to React Native.
 */

/**
 * Map a USDA hardiness zone (1–13) to a zone band string.
 * @param {number|string} zone
 * @returns {'cold'|'temperate'|'warm'|'hot'|null}
 */
export function zoneBand(zone) {
  const z = parseInt(zone, 10)
  if (isNaN(z)) return null
  if (z >= 1 && z <= 5) return 'cold'
  if (z >= 6 && z <= 7) return 'temperate'
  if (z >= 8 && z <= 9) return 'warm'
  if (z >= 10 && z <= 13) return 'hot'
  return null
}

/**
 * Get the timing object for a plant in a given zone band.
 * @param {object} plant  - plant from database
 * @param {string} band   - 'cold'|'temperate'|'warm'|'hot'
 * @returns {{ indoor_start, transplant, direct_sow, harvest } | null}
 */
export function getPlantTiming(plant, band) {
  if (!plant?.timing || !band) return null
  return plant.timing[band] ?? null
}

/** Human-readable zone band label */
export function zoneBandLabel(band) {
  const labels = {
    cold: 'Cold (Zones 1–5)',
    temperate: 'Temperate (Zones 6–7)',
    warm: 'Warm (Zones 8–9)',
    hot: 'Hot (Zones 10–13)',
  }
  return labels[band] ?? 'Unknown zone'
}
