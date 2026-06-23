import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { SectorStoryPage } from './features/sectorStory/SectorStoryPage'
import { SectorSummaryPage } from './features/sectorStory/SectorSummaryPage'
import { SectorsPage } from './features/sectorStory/SectorsPage'
import { TropelsPage } from './features/tropels/TropelsPage'
import { SignalsProvider } from './features/signals/SignalsProvider'
import { SignalsFeedPage } from './features/signals/SignalsFeedPage'
import { SignalDetailPage } from './features/signals/SignalDetailPage'
function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<LoginPage />} />

      {/* Privado: restaura sesión y comparte el layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tropels" element={<TropelsPage />} />
          {/* Feed y detalle comparten provider para conservar estado y scroll */}
          <Route element={<SignalsProvider />}>
            <Route path="/signals" element={<SignalsFeedPage />} />
            <Route path="/signals/:id" element={<SignalDetailPage />} />
          </Route>
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/sectors/:id" element={<SectorSummaryPage />} />
          <Route path="/sectors/:id/story" element={<SectorStoryPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
