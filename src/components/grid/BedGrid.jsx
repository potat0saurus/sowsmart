import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import GridCell from './GridCell.jsx'
import DraggablePlant from '../plants/DraggablePlant.jsx'
import { plantsById } from '../../data/plants.js'
import styles from './BedGrid.module.css'

export default function BedGrid({
  width,
  height,
  placements,
  warnings,
  onMove,
  onRemove,
  onCellClick,
  selectedCellIndex,
}) {
  const [activeId, setActiveId] = useState(null) // dragging cell id

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const cellMap = Object.fromEntries(placements.map(p => [p.cellIndex, p.plantId]))

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const fromIndex = parseInt(active.id.replace('draggable-', ''), 10)
    const toIndex   = parseInt(over.id.replace('cell-', ''), 10)

    if (!isNaN(fromIndex) && !isNaN(toIndex)) {
      onMove(fromIndex, toIndex)
    }
  }

  const activePlantId = activeId
    ? cellMap[parseInt(activeId.replace('draggable-', ''), 10)]
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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

      <DragOverlay>
        {activePlantId ? (
          <div className={styles.dragOverlay}>
            <span>{plantsById[activePlantId]?.emoji}</span>
            <span>{plantsById[activePlantId]?.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
