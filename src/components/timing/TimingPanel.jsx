import { plantsById } from '../../data/plants.js'
import { getPlantTiming, zoneBand, zoneBandLabel } from '../../lib/timing.js'
import { useAppContext } from '../../context/AppContext.jsx'
import Input from '../ui/Input.jsx'
import styles from './TimingPanel.module.css'

export default function TimingPanel({ selectedPlantIds }) {
  const { usdaZone, updateZone } = useAppContext()
  const band = zoneBand(usdaZone)

  return (
    <div className={styles.panel}>
      <div className={styles.zoneInput}>
        <Input
          id="usda-zone"
          label="Your USDA Hardiness Zone (1–13)"
          type="number"
          min={1}
          max={13}
          value={usdaZone}
          onChange={e => updateZone(e.target.value)}
          placeholder="e.g. 7"
          hint={band ? `Zone band: ${zoneBandLabel(band)}` : 'Enter your zone to see timing'}
          className={styles.zoneField}
        />
      </div>

      {selectedPlantIds.length === 0 && (
        <p className={styles.empty}>Select plants to see planting timing.</p>
      )}

      {!band && selectedPlantIds.length > 0 && (
        <p className={styles.empty}>Enter your USDA zone above to see timing guidance.</p>
      )}

      {band && selectedPlantIds.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plant</th>
              <th>Start indoors</th>
              <th>Transplant</th>
              <th>Direct sow</th>
              <th>Harvest</th>
            </tr>
          </thead>
          <tbody>
            {selectedPlantIds.map(id => {
              const plant = plantsById[id]
              if (!plant) return null
              const timing = getPlantTiming(plant, band)
              return (
                <tr key={id}>
                  <td className={styles.plantCell}>
                    <span>{plant.emoji}</span>
                    <span>{plant.name}</span>
                  </td>
                  <td>{timing?.indoor_start ?? '—'}</td>
                  <td>{timing?.transplant ?? '—'}</td>
                  <td>{timing?.direct_sow ?? '—'}</td>
                  <td>{timing?.harvest ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
