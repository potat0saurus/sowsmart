import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { PlantsProvider, usePlants } from './context/PlantsContext.jsx'
import AppShell from './components/layout/AppShell.jsx'
import HomePage from './pages/HomePage.jsx'
import BedPlannerPage from './pages/BedPlannerPage.jsx'

export default function App() {
  return (
    <HashProvider>
      <PlantsProvider>
        <AppProvider>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </AppProvider>
      </PlantsProvider>
    </HashProvider>
  )
}

function AppRoutes() {
  const { plantsLoading, plantsError } = usePlants()

  if (plantsLoading) return <div style={{ padding: '2rem' }}>Loading plants…</div>
  if (plantsError) return <div style={{ padding: '2rem' }}>Failed to load plants: {plantsError}</div>

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bed/:id" element={<BedPlannerPage />} />
    </Routes>
  )
}

// Small wrapper to keep JSX clean
function HashProvider({ children }) {
  return <HashRouter>{children}</HashRouter>
}
