import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import AppShell from './components/layout/AppShell.jsx'
import HomePage from './pages/HomePage.jsx'
import BedPlannerPage from './pages/BedPlannerPage.jsx'

export default function App() {
  return (
    <HashProvider>
      <AppProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bed/:id" element={<BedPlannerPage />} />
          </Routes>
        </AppShell>
      </AppProvider>
    </HashProvider>
  )
}

// Small wrapper to keep JSX clean
function HashProvider({ children }) {
  return <HashRouter>{children}</HashRouter>
}
