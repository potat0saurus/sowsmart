import BedCard from './BedCard.jsx'
import styles from './BedList.module.css'

export default function BedList({ beds, onDelete, onEdit }) {
  if (beds.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>🌱</p>
        <p className={styles.emptyText}>No beds yet — create your first one!</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {beds.map(bed => (
        <BedCard
          key={bed.id}
          bed={bed}
          onDelete={() => onDelete(bed.id)}
          onEdit={() => onEdit(bed)}
        />
      ))}
    </div>
  )
}
