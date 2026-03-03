import { usePlants } from '../../context/PlantsContext.jsx'
import { iconUrl } from '../../lib/icons.js'
import styles from './PlantPill.module.css'

export default function PlantPill({ plantId, onRemove }) {
  const { plantsById } = usePlants()
  const plant = plantsById[plantId]
  if (!plant) return null

  return (
    <span className={styles.pill}>
      <img src={iconUrl(plant.icon)} alt="" className={styles.icon} />
      {plant.name}
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
