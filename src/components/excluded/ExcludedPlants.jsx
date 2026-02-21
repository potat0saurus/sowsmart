import { useState } from 'react'
import { plantsById } from '../../data/plants.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import styles from './ExcludedPlants.module.css'

/**
 * Shows plants that didn't fit in the grid.
 * Lets the user swap them in by picking a placed plant to remove.
 */
export default function ExcludedPlants({ excludedPlantIds, placements, onSwap }) {
  const [swapping, setSwapping] = useState(null) // plantId being swapped in

  if (excludedPlantIds.length === 0) return null

  function handleSwap(excludedId) {
    setSwapping(excludedId)
  }

  function handlePickReplacement(cellIndex) {
    if (!swapping) return
    onSwap(cellIndex, swapping)
    setSwapping(null)
  }

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.heading}>
        ⚠ {excludedPlantIds.length} plant{excludedPlantIds.length > 1 ? 's' : ''} didn't fit
      </h4>
      <p className={styles.hint}>
        Your bed is full. Tap "Swap in" to replace a placed plant.
      </p>

      <div className={styles.list}>
        {excludedPlantIds.map(id => {
          const plant = plantsById[id]
          if (!plant) return null
          return (
            <div key={id} className={styles.item}>
              <span className={styles.emoji}>{plant.emoji}</span>
              <span className={styles.name}>{plant.name}</span>
              <Button size="sm" variant="secondary" onClick={() => handleSwap(id)}>
                Swap in
              </Button>
            </div>
          )
        })}
      </div>

      <Modal
        isOpen={!!swapping}
        onClose={() => setSwapping(null)}
        title={`Swap in ${swapping ? plantsById[swapping]?.name : ''}?`}
      >
        <p className={styles.modalHint}>
          Choose a placed plant to remove in its place:
        </p>
        <div className={styles.placedList}>
          {placements.map(({ cellIndex, plantId }) => {
            const plant = plantsById[plantId]
            if (!plant) return null
            return (
              <button
                key={cellIndex}
                className={styles.placedItem}
                onClick={() => handlePickReplacement(cellIndex)}
              >
                <span>{plant.emoji}</span>
                <span>{plant.name}</span>
                <span className={styles.cellLabel}>Cell {cellIndex + 1}</span>
              </button>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
