import { createContext, useContext, useEffect, useState } from 'react'
import { getPlants } from '../services/plantService'

const PlantsContext = createContext(null)

export function PlantsProvider({ children }) {
  const [plants, setPlants] = useState([])
  const [plantsById, setPlantsById] = useState({})
  const [plantsLoading, setPlantsLoading] = useState(true)
  const [plantsError, setPlantsError] = useState(null)

  useEffect(() => {
    getPlants()
      .then(({ plants, plantsById }) => {
        setPlants(plants)
        setPlantsById(plantsById)
      })
      .catch(err => setPlantsError(err.message))
      .finally(() => setPlantsLoading(false))
  }, [])

  return (
    <PlantsContext.Provider value={{ plants, plantsById, plantsLoading, plantsError }}>
      {children}
    </PlantsContext.Provider>
  )
}

export function usePlants() {
  const ctx = useContext(PlantsContext)
  if (!ctx) throw new Error('usePlants must be used inside PlantsProvider')
  return ctx
}
