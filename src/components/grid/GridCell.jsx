import { useDroppable } from '@dnd-kit/core'
import { usePlants } from '../../context/PlantsContext.jsx'
import { getCellSeverity } from '../../lib/compatibility.js'
import WarningBadge from './WarningBadge.jsx'
import styles from './GridCell.module.css'

export default function GridCell({
  cellIndex,
  plantId,
  warnings,
  onRemove,
  onClick,
  isSelected,
}) {
  const { plantsById } = usePlants()
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${cellIndex}` })
  const plant = plantId ? plantsById[plantId] : null
  const severity = getCellSeverity(warnings ?? {}, cellIndex)
  const cellWarnings = (warnings ?? {})[cellIndex]

  return (
    <div
      ref={setNodeRef}
      className={[
        styles.cell,
        plant ? styles.filled : styles.empty,
        severity === 'incompatible' ? styles.warnIncompatible : '',
        severity === 'competitor' ? styles.warnCompetitor : '',
        isOver ? styles.dropTarget : '',
        isSelected ? styles.selected : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role="gridcell"
      aria-label={plant ? `${plant.name} at cell ${cellIndex + 1}` : `Empty cell ${cellIndex + 1}`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
    >
      {plant ? (
        <>
          <span className={styles.emoji}>{plant.emoji}</span>
          <span className={styles.name}>{plant.name}</span>
          <span className={styles.count}>
            {plant.plantsPerSquare > 1 ? `×${plant.plantsPerSquare}` : ''}
          </span>
          <WarningBadge warnings={cellWarnings} />
          <button
            className={styles.removeBtn}
            onClick={e => { e.stopPropagation(); onRemove?.(cellIndex) }}
            aria-label={`Remove ${plant.name}`}
            tabIndex={-1}
          >
            ✕
          </button>
        </>
      ) : (
        <span className={styles.plusIcon}>+</span>
      )}
    </div>
  )
}
