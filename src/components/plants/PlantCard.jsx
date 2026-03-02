import { iconUrl } from '../../lib/icons.js'
import styles from './PlantCard.module.css'

export default function PlantCard({ plant, isSelected, onToggle, companionIds = [] }) {
  const isCompanion = companionIds.includes(plant.id)

  return (
    <button
      className={[
        styles.card,
        isSelected ? styles.selected : '',
        isCompanion ? styles.companion : '',
      ].filter(Boolean).join(' ')}
      onClick={() => onToggle(plant.id)}
      aria-pressed={isSelected}
      aria-label={`${plant.name} — ${isSelected ? 'selected' : 'not selected'}${isCompanion ? ', companion plant' : ''}`}
    >
      <img src={iconUrl(plant.icon)} alt="" className={styles.icon} />
      <span className={styles.name}>{plant.name}</span>
      <span className={styles.pps}>{plant.plantsPerSquare}/sq</span>
      {isCompanion && (
        <span className={styles.companionDot} title="Companion to a selected plant">★</span>
      )}
    </button>
  )
}
