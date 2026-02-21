import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import { loadBed, saveBed } from '../lib/storage.js'
import { useGrid } from '../hooks/useGrid.js'
import { plantsById } from '../data/plants.js'
import BedGrid from '../components/grid/BedGrid.jsx'
import PlantSelector from '../components/plants/PlantSelector.jsx'
import PlantPill from '../components/plants/PlantPill.jsx'
import CompanionPanel from '../components/companions/CompanionPanel.jsx'
import TimingPanel from '../components/timing/TimingPanel.jsx'
import ExcludedPlants from '../components/excluded/ExcludedPlants.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import styles from './BedPlannerPage.module.css'
import gridStyles from '../components/grid/BedGrid.module.css'

const TABS = ['Plants', 'Companions', 'Timing']

export default function BedPlannerPage() {
  const { id } = useParams()
  const [bedData, setBedData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('Plants')
  const [saved, setSaved] = useState(true)
  const [selectedCellIndex, setSelectedCellIndex] = useState(null)
  const [showPlantPickerModal, setShowPlantPickerModal] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const suppressNextCellClick = useRef(false)

  // Load bed on mount
  useEffect(() => {
    const loaded = loadBed(id)
    if (!loaded) { setNotFound(true); return }
    setBedData(loaded)
  }, [id])

  const {
    state,
    setBedMeta,
    togglePlantSelected,
    applySuggestion,
    movePlant,
    placePlant,
    removePlant,
    swapExcluded,
  } = useGrid(
    bedData,
    bedData?.selectedPlantIds,
    bedData?.placements
  )

  // Sync bed into grid when it loads
  useEffect(() => {
    if (bedData) setBedMeta(bedData)
  }, [bedData]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save whenever state changes (debounced 800 ms)
  useEffect(() => {
    if (!state.bed) return
    setSaved(false)
    const t = setTimeout(() => {
      saveBed({
        ...state.bed,
        selectedPlantIds: state.selectedPlantIds,
        placements: state.placements,
      })
      setSaved(true)
    }, 800)
    return () => clearTimeout(t)
  }, [state.bed, state.selectedPlantIds, state.placements])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const cellMap = useMemo(
    () => Object.fromEntries((state.placements ?? []).map(p => [p.cellIndex, p.plantId])),
    [state.placements]
  )

  const activePlant = useMemo(() => {
    if (!activeId) return null
    const s = String(activeId)
    if (s.startsWith('palette-')) {
      return plantsById[s.replace('palette-', '')]
    }
    if (s.startsWith('draggable-')) {
      const idx = parseInt(s.replace('draggable-', ''), 10)
      const plantId = cellMap[idx]
      return plantId ? plantsById[plantId] : null
    }
    return null
  }, [activeId, cellMap])

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return

    const activeStr = String(active.id)
    const overStr   = String(over.id)

    if (activeStr.startsWith('palette-')) {
      if (!overStr.startsWith('cell-')) return
      const plantId   = activeStr.replace('palette-', '')
      const cellIndex = parseInt(overStr.replace('cell-', ''), 10)
      if (isNaN(cellIndex)) return
      placePlant(cellIndex, plantId)
      if (!state.selectedPlantIds.includes(plantId)) {
        togglePlantSelected(plantId)
      }
      suppressNextCellClick.current = true
    } else if (activeStr.startsWith('draggable-')) {
      if (active.id === over.id) return
      const fromIndex = parseInt(activeStr.replace('draggable-', ''), 10)
      const toIndex   = parseInt(overStr.replace('cell-', ''), 10)
      if (!isNaN(fromIndex) && !isNaN(toIndex)) {
        movePlant(fromIndex, toIndex)
      }
    }
  }

  function handleCellClick(cellIndex) {
    if (suppressNextCellClick.current) {
      suppressNextCellClick.current = false
      return
    }
    if (!cellMap[cellIndex]) {
      setSelectedCellIndex(cellIndex)
      setShowPlantPickerModal(true)
    } else {
      setSelectedCellIndex(prev => prev === cellIndex ? null : cellIndex)
    }
  }

  function handlePlantPickForCell(plantId) {
    if (selectedCellIndex == null) return
    placePlant(selectedCellIndex, plantId)
    setShowPlantPickerModal(false)
    setSelectedCellIndex(null)
  }

  function handleClosePickerModal() {
    setShowPlantPickerModal(false)
    setSelectedCellIndex(null)
  }

  if (notFound) {
    return (
      <div className={styles.notFound}>
        <p>Bed not found.</p>
        <Link to="/">← Back to beds</Link>
      </div>
    )
  }

  if (!state.bed) {
    return <div className={styles.loading}>Loading…</div>
  }

  const { bed, selectedPlantIds, placements, excludedPlantIds, warnings } = state

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <Link to="/" className={styles.backLink}>← All beds</Link>
          <h1 className={styles.bedName}>{bed.name}</h1>
          <p className={styles.bedMeta}>
            {bed.width} × {bed.height} ft · {bed.width * bed.height} sq ft
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={`${styles.saveIndicator} ${saved ? styles.saved : styles.saving}`}>
            {saved ? '✓ Saved' : 'Saving…'}
          </span>
          <Button
            variant="primary"
            disabled={selectedPlantIds.length === 0}
            onClick={applySuggestion}
            title={selectedPlantIds.length === 0 ? 'Select plants first' : 'Generate optimised layout'}
          >
            ✨ Suggest Layout
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.layout}>
          {/* Left: grid + pills + excluded */}
          <div className={styles.gridArea}>
            <div className={styles.gridScroll}>
              <BedGrid
                width={bed.width}
                height={bed.height}
                placements={placements}
                warnings={warnings}
                onMove={movePlant}
                onRemove={removePlant}
                onCellClick={handleCellClick}
                selectedCellIndex={selectedCellIndex}
              />
            </div>

            {selectedPlantIds.length > 0 && (
              <div className={styles.selectedPills}>
                <span className={styles.pillsLabel}>Selected:</span>
                {selectedPlantIds.map(plantId => (
                  <PlantPill
                    key={plantId}
                    plantId={plantId}
                    onRemove={() => togglePlantSelected(plantId)}
                  />
                ))}
              </div>
            )}

            {excludedPlantIds.length > 0 && (
              <ExcludedPlants
                excludedPlantIds={excludedPlantIds}
                placements={placements}
                onSwap={swapExcluded}
              />
            )}
          </div>

          {/* Right: sidebar tabs */}
          <div className={styles.sidebar}>
            <div className={styles.tabs} role="tablist">
              {TABS.map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'Plants' && (
                <PlantSelector
                  selectedPlantIds={selectedPlantIds}
                  onToggle={togglePlantSelected}
                />
              )}
              {activeTab === 'Companions' && (
                <CompanionPanel selectedPlantIds={selectedPlantIds} />
              )}
              {activeTab === 'Timing' && (
                <TimingPanel selectedPlantIds={selectedPlantIds} />
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activePlant ? (
            <div className={gridStyles.dragOverlay}>
              <span>{activePlant.emoji}</span>
              <span>{activePlant.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Cell plant-picker modal */}
      <Modal
        isOpen={showPlantPickerModal}
        onClose={handleClosePickerModal}
        title="Place a plant"
      >
        {selectedPlantIds.length === 0 ? (
          <p className={styles.modalHint}>
            No plants selected yet. Go to the Plants tab and select plants first, then click a cell.
          </p>
        ) : (
          <>
            <p className={styles.modalHint}>Pick a plant to place in this cell:</p>
            <div className={styles.modalPlantList}>
              {selectedPlantIds.map(plantId => {
                const plant = plantsById[plantId]
                if (!plant) return null
                return (
                  <button
                    key={plantId}
                    className={styles.modalPlantBtn}
                    onClick={() => handlePlantPickForCell(plantId)}
                  >
                    <span className={styles.modalPlantEmoji}>{plant.emoji}</span>
                    <span>{plant.name}</span>
                    <span className={styles.modalPlantPps}>{plant.plantsPerSquare}/sq ft</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
