import { useMemo } from 'react'
import { plants, plantsById } from '../../data/plants.js'
import Badge from '../ui/Badge.jsx'
import styles from './CompanionPanel.module.css'

export default function CompanionPanel({ selectedPlantIds }) {
  const rows = useMemo(() => {
    return selectedPlantIds.map(id => {
      const plant = plantsById[id]
      if (!plant) return null

      const companions = plant.companions.filter(c => selectedPlantIds.includes(c))
      const competitors = plant.competitors.filter(c => selectedPlantIds.includes(c))
      const incompatible = plant.incompatible.filter(c => selectedPlantIds.includes(c))

      // Suggested companions not yet selected
      const suggested = plant.companions
        .filter(c => !selectedPlantIds.includes(c))
        .map(c => plantsById[c])
        .filter(Boolean)
        .slice(0, 3)

      return { plant, companions, competitors, incompatible, suggested }
    }).filter(Boolean)
  }, [selectedPlantIds])

  if (selectedPlantIds.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Select plants above to see companion planting information.</p>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      {rows.map(({ plant, companions, competitors, incompatible, suggested }) => (
        <div key={plant.id} className={styles.row}>
          <div className={styles.plantName}>
            <span>{plant.emoji}</span>
            <strong>{plant.name}</strong>
          </div>

          <div className={styles.relationships}>
            {companions.length > 0 && (
              <div className={styles.group}>
                {companions.map(id => (
                  <Badge key={id} variant="companion">
                    ✓ {plantsById[id]?.emoji} {plantsById[id]?.name}
                  </Badge>
                ))}
              </div>
            )}
            {competitors.length > 0 && (
              <div className={styles.group}>
                {competitors.map(id => (
                  <Badge key={id} variant="competitor">
                    ⚡ {plantsById[id]?.emoji} {plantsById[id]?.name}
                  </Badge>
                ))}
              </div>
            )}
            {incompatible.length > 0 && (
              <div className={styles.group}>
                {incompatible.map(id => (
                  <Badge key={id} variant="incompatible">
                    ⚠ {plantsById[id]?.emoji} {plantsById[id]?.name}
                  </Badge>
                ))}
              </div>
            )}
            {suggested.length > 0 && (
              <p className={styles.suggestion}>
                <span className={styles.suggestionLabel}>Good companions to add:</span>{' '}
                {suggested.map(p => `${p.emoji} ${p.name}`).join(', ')}
              </p>
            )}
            {companions.length === 0 && competitors.length === 0 &&
             incompatible.length === 0 && suggested.length === 0 && (
              <span className={styles.neutral}>No relationships with current selection.</span>
            )}
          </div>
        </div>
      ))}

      <CompatibilityLegend />
    </div>
  )
}

function CompatibilityLegend() {
  return (
    <div className={styles.legend}>
      <Badge variant="companion">✓ Companion</Badge>
      <Badge variant="competitor">⚡ Competitor</Badge>
      <Badge variant="incompatible">⚠ Incompatible</Badge>
    </div>
  )
}
