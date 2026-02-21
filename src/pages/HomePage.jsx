import { useState } from 'react'
import { useBeds } from '../hooks/useBeds.js'
import BedList from '../components/beds/BedList.jsx'
import BedSetupForm from '../components/beds/BedSetupForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import styles from './HomePage.module.css'

function generateId() {
  return 'bed_' + Math.random().toString(36).slice(2, 10)
}

export default function HomePage() {
  const { beds, addBed, updateBed, removeBed } = useBeds()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBed, setEditingBed] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  function handleCreate(formData) {
    const now = new Date().toISOString()
    const bed = {
      id: generateId(),
      ...formData,
      selectedPlantIds: [],
      placements: [],
      createdAt: now,
      updatedAt: now,
    }
    addBed(bed)
    setShowCreateModal(false)
  }

  function handleEdit(formData) {
    if (!editingBed) return
    updateBed({ ...editingBed, ...formData })
    setEditingBed(null)
  }

  function handleDelete(bedId) {
    setConfirmDeleteId(bedId)
  }

  function confirmDelete() {
    if (confirmDeleteId) removeBed(confirmDeleteId)
    setConfirmDeleteId(null)
  }

  const bedToDelete = beds.find(b => b.id === confirmDeleteId)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>My Garden Beds</h1>
          <p className={styles.subtitle}>
            Plan each bed separately. Click a bed to open the planner.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + New Bed
        </Button>
      </div>

      <BedList
        beds={beds}
        onDelete={handleDelete}
        onEdit={bed => setEditingBed(bed)}
      />

      {/* Create modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create a new bed"
      >
        <BedSetupForm
          onSave={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingBed}
        onClose={() => setEditingBed(null)}
        title="Edit bed"
      >
        {editingBed && (
          <BedSetupForm
            initial={editingBed}
            onSave={handleEdit}
            onCancel={() => setEditingBed(null)}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete bed?"
      >
        <div className={styles.confirmContent}>
          <p>
            Delete <strong>{bedToDelete?.name}</strong>? This cannot be undone.
          </p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
