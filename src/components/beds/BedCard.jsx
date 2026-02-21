import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import styles from './BedCard.module.css'

export default function BedCard({ bed, onDelete, onEdit }) {
  const totalCells = bed.width * bed.height
  const filledCells = (bed.placements ?? []).length

  return (
    <div className={styles.card}>
      <div className={styles.preview}>
        <BedMiniPreview
          width={bed.width}
          height={bed.height}
          placements={bed.placements ?? []}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{bed.name}</h3>
        <p className={styles.meta}>
          {bed.width} × {bed.height} ft · {totalCells} sq ft
          {filledCells > 0 && ` · ${filledCells} planted`}
        </p>

        <div className={styles.actions}>
          <Link to={`/bed/${bed.id}`} className={styles.planLink}>
            Open planner →
          </Link>
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit bed name/size">
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} aria-label={`Delete ${bed.name}`}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

function BedMiniPreview({ width, height, placements }) {
  const MAX_CELLS = 64
  const cellMap = Object.fromEntries(placements.map(p => [p.cellIndex, p.plantId]))
  const cells = Math.min(width * height, MAX_CELLS)

  return (
    <div
      className={styles.miniGrid}
      style={{
        gridTemplateColumns: `repeat(${Math.min(width, 8)}, 1fr)`,
      }}
    >
      {Array.from({ length: cells }, (_, i) => (
        <div
          key={i}
          className={`${styles.miniCell} ${cellMap[i] ? styles.miniCellFilled : ''}`}
          title={cellMap[i] ?? ''}
        />
      ))}
    </div>
  )
}
