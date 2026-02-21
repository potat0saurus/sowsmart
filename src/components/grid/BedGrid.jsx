import GridCell from './GridCell.jsx'
import DraggablePlant from '../plants/DraggablePlant.jsx'
import styles from './BedGrid.module.css'

export default function BedGrid({
  width,
  height,
  placements,
  warnings,
  onRemove,
  onCellClick,
  selectedCellIndex,
}) {
  const cellMap = Object.fromEntries(placements.map(p => [p.cellIndex, p.plantId]))

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${width}, var(--cell-size))` }}
      role="grid"
      aria-label={`${width} × ${height} garden grid`}
    >
      {Array.from({ length: width * height }, (_, i) => {
        const plantId = cellMap[i]
        return plantId ? (
          <DraggablePlant key={i} cellIndex={i}>
            <GridCell
              cellIndex={i}
              plantId={plantId}
              warnings={warnings}
              onRemove={onRemove}
              onClick={() => onCellClick?.(i)}
              isSelected={selectedCellIndex === i}
            />
          </DraggablePlant>
        ) : (
          <GridCell
            key={i}
            cellIndex={i}
            plantId={null}
            warnings={warnings}
            onClick={() => onCellClick?.(i)}
            isSelected={selectedCellIndex === i}
          />
        )
      })}
    </div>
  )
}
