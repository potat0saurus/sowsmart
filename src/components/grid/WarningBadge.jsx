import { plantsById } from '../../data/plants.js'
import styles from './WarningBadge.module.css'

export default function WarningBadge({ warnings }) {
  if (!warnings || warnings.length === 0) return null

  const hasIncompatible = warnings.some(w => w.startsWith('incompatible'))
  const level = hasIncompatible ? 'incompatible' : 'competitor'

  const label = hasIncompatible ? '⚠ Incompatible' : '⚡ Competitor'

  const details = warnings.map(w => {
    const [type, id] = w.split(':')
    const plant = plantsById[id]
    return `${type === 'incompatible' ? 'Incompatible' : 'Competes'} with ${plant?.name ?? id}`
  })

  return (
    <span
      className={`${styles.badge} ${styles[level]}`}
      title={details.join('\n')}
      aria-label={details.join('; ')}
    >
      {hasIncompatible ? '⚠' : '⚡'}
    </span>
  )
}
