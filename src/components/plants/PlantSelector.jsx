import { useState, useMemo } from 'react'
import { plants } from '../../data/plants.js'
import PlantCard from './PlantCard.jsx'
import Input from '../ui/Input.jsx'
import styles from './PlantSelector.module.css'

export default function PlantSelector({ selectedPlantIds, onToggle }) {
  const [search, setSearch] = useState('')

  // Compute which plants are companions of currently-selected plants
  const companionIds = useMemo(() => {
    const ids = new Set()
    for (const id of selectedPlantIds) {
      const plant = plants.find(p => p.id === id)
      if (plant) plant.companions.forEach(c => ids.add(c))
    }
    // Don't highlight already-selected plants as companions
    selectedPlantIds.forEach(id => ids.delete(id))
    return [...ids]
  }, [selectedPlantIds])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return plants.filter(p => p.name.toLowerCase().includes(q))
  }, [search])

  return (
    <div className={styles.wrapper}>
      <Input
        id="plant-search"
        placeholder="Search plants…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={styles.search}
      />

      {selectedPlantIds.length > 0 && companionIds.length > 0 && (
        <p className={styles.companionHint}>
          ★ Highlighted plants are companions to your selection.
        </p>
      )}

      <div className={styles.grid}>
        {filtered.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            isSelected={selectedPlantIds.includes(plant.id)}
            onToggle={onToggle}
            companionIds={companionIds}
          />
        ))}
        {filtered.length === 0 && (
          <p className={styles.noResults}>No plants match "{search}"</p>
        )}
      </div>
    </div>
  )
}
