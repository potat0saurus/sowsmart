import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import PlantCard from './PlantCard.jsx'

export default function DraggablePaletteCard({ plant, isSelected, onToggle, companionIds }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${plant.id}`,
    data: { plantId: plant.id },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <PlantCard
        plant={plant}
        isSelected={isSelected}
        onToggle={onToggle}
        companionIds={companionIds}
      />
    </div>
  )
}
