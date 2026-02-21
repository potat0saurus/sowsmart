import { plantsById } from '../../data/plants.js'
import styles from './PlantPill.module.css'

export default function PlantPill({ plantId, onRemove }) {
  const plant = plantsById[plantId]
  if (!plant) return null

  return (
    <span className={styles.pill}>
      {plant.emoji} {plant.name}
      {onRemove && (
        <button
          className={styles.remove}
          onClick={() => onRemove(plantId)}
          aria-label={`Remove ${plant.name}`}
        >
          ✕
        </button>
      )}
    </span>
  )
}
