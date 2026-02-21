import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Only truly global state: the user's USDA zone
  const [usdaZone, setUsdaZone] = useState(() => {
    return localStorage.getItem('sowsmart_zone') ?? ''
  })

  function updateZone(zone) {
    setUsdaZone(zone)
    localStorage.setItem('sowsmart_zone', zone)
  }

  return (
    <AppContext.Provider value={{ usdaZone, updateZone }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}
