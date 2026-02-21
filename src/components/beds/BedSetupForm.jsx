import { useState } from 'react'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import styles from './BedSetupForm.module.css'

export default function BedSetupForm({ initial, onSave, onCancel }) {
  const [name, setName]     = useState(initial?.name ?? '')
  const [width, setWidth]   = useState(initial?.width ?? 4)
  const [height, setHeight] = useState(initial?.height ?? 4)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required.'
    const w = parseInt(width, 10)
    const h = parseInt(height, 10)
    if (!w || w < 1 || w > 20) e.width = 'Width must be 1–20 ft.'
    if (!h || h < 1 || h > 20) e.height = 'Height must be 1–20 ft.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSave({
      name: name.trim(),
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    })
  }

  const totalCells = parseInt(width, 10) * parseInt(height, 10)
  const valid = !isNaN(totalCells) && totalCells > 0

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        id="bed-name"
        label="Bed name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Raised bed #1"
        error={errors.name}
        autoFocus
      />

      <div className={styles.dims}>
        <Input
          id="bed-width"
          label="Width (ft)"
          type="number"
          min={1}
          max={20}
          value={width}
          onChange={e => setWidth(e.target.value)}
          error={errors.width}
        />
        <span className={styles.dimsSep}>×</span>
        <Input
          id="bed-height"
          label="Length (ft)"
          type="number"
          min={1}
          max={20}
          value={height}
          onChange={e => setHeight(e.target.value)}
          error={errors.height}
        />
      </div>

      {valid && (
        <p className={styles.hint}>
          {width} × {height} = <strong>{totalCells} sq ft</strong>
        </p>
      )}

      <div className={styles.actions}>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {initial ? 'Save changes' : 'Create bed'}
        </Button>
      </div>
    </form>
  )
}
